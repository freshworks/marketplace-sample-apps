"use strict";

exports = {
  events: [
    { event: "onAppInstall", callback: "onInstallHandler" },
    { event: "onAppUninstall", callback: "onUnInstallHandler" },
    { event: "onExternalEvent", callback: "onWebhookCallbackHandler" },
  ],

  /**
   * Handler for onAppInstall event
   *
   * A webhook url is created through generateTargetUrl function.
   * The generated url is registered with GitHub for "issues" related events and the same is triggered when an issues is created or modified.
   * On successful registration, the webhook URL is stored using $db
   *
   * @param {object} args - payload
   */
  onInstallHandler: function (args) {
    generateTargetUrl()
      .then(function (targetUrl) {
        $request
          .post(
            `https://api.github.com/repos/${args.iparams.github_username}/${args.iparams.github_repo_name}/hooks`,
            {
              headers: {
                Authorization: "token <%= access_token %>",
                "User-Agent": "Awesome-Octocat-App",
              },
              isOAuth: true,
              json: {
                name: "web",
                active: true,
                events: ["issues"],
                config: {
                  url: targetUrl,
                  content_type: "json",
                },
              },
            }
          )
          .then(
            (data) => {
              $db.set("githubWebhookId", { url: data.response.url }).then(
                function () {
                  console.log("Successfully stored the webhook in the db");
                  renderData();
                },
                (error) => {
                  console.log(
                    "Error: Failed to store the webhook URL in the db"
                  );
                  console.log(error);
                  renderData({ message: "The webhook registration failed" });
                }
              );
            },
            (error) => {
              console.log(
                "Error: Failed to register the webhook for GitHub repo"
              );
              console.log(error);
              renderData({ message: "The webhook registration failed" });
            }
          );
      })
      .fail(function () {
        console.log("Error: Failed to generate the webhook");
        renderData({ message: "The webhook registration failed" });
      });
  },

  /**
   * Handler for onAppUninstall event
   *
   * Gets the webhook URL from the data storage through $db that was stored during installation
   * Then deregister the webhook from GitHub with the URL over REST API
   *
   * @param {object} args - payload
   */
  onUnInstallHandler: function (args) {
    $db.get("githubWebhookId").then(
      function (data) {
        $request
          .delete(data.url, {
            headers: {
              Authorization: "token <%= access_token %>",
              "User-Agent": "Awesome-Octocat-App",
              Accept: "application/json",
            },
            isOAuth: true,
          })
          .then(
            () => {
              console.log(
                "Successfully deregistered the webhook for GitHub repo"
              );
              renderData();
            },
            () => renderData()
          );
      },
      (error) => {
        console.log("Error: Failed to get the stored webhook URL from the db");
        console.log(error);
        renderData({ message: "The webhook deregistration failed" });
      }
    );
  },

  /**
   * Handler for onExternalEvent event
   *
   * Checks if the received issue event is of action 'opened' which is received for new issue creation.
   * Creates a ticket in freshdesk with the issue title and description.
   *
   * @param {object} payload - payload with the data from the third-party applications along with iparams and other metadata
   */
  onWebhookCallbackHandler: function (payload) {
    const payloadData =
      typeof payload.data === "string"
        ? JSON.parse(payload.data)
        : payload.data;
    if (payloadData.action === "opened") {
      $request
        .post(payload.domain + "/api/v2/tickets", {
          headers: {
            Authorization: "<%= encode(iparam.freshdesk_api_key) %>",
          },
          json: {
            status: 2,
            priority: 3,
            email: payload.iparams.ticket_email,
            subject: payloadData.issue.title,
            description: payloadData.issue.body,
          },
          method: "POST",
        })
        .then(
          () => {
            console.log("Successfully created ticket in Freshdesk");
          },
          (error) => {
            console.log("Error: Failed to create ticket in Freshdesk");
            console.log(error);
          }
        );
    } else {
      console.log("The action of the GitHub issue is not defined");
    }
  },
};
