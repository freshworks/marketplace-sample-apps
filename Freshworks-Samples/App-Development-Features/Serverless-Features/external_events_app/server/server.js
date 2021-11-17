const util = require('./lib/util');

exports = {
  /**
   * Handler for onAppInstall event
   *
   * Webhook url is created through generateTargetUrl function
   * The generated url is registered with jira for "issue_created" event and the same is triggered when an issues is created.
   * On successful registration, the webhook URL  is stored using $db
   *
   * @param {object} args - payload
   */
  onInstallHandler: function (args) {
    generateTargetUrl().done(function (targetUrl) {
      $request.post(
        args.iparams.jira_url + "/rest/webhooks/1.0/webhook",
        {
          headers: {
            "Authorization": "Basic " + util.getJiraKey(args)
          },
          json: {
            url: targetUrl,
            name: "External events - Freshdesk Integration",
            events: ["jira:issue_created"],
            excludeIssueDetails: false
          }
        }
      )
        .then((data) => {
          $db.set('jiraWebhookId', { url: data.self }).done(() => {
            renderData();
          }).fail(() => {
            renderData({ message: 'Webhook registration failed' });
          })
        }, error => {
          console.error('Failed to register the webhook');
          console.error(error);
          renderData({ message: 'Webhook registration failed' });
        });
    }).fail(function () {
      renderData({ message: 'Webhook registration failed' });
    });
  },

  /**
   * Handler for onAppUninstall event
   *
   * Get the webhook URL from data storage through $db that was stored during installation
   * Deregister the webhook from JIRA with the URL over REST API
   *
   * @param {object} args - payload
   */
  onUnInstallHandler: function (args) {
    $db.get('jiraWebhookId').done(function (data) {
      $request.delete(
        data.url,
        {
          headers: {
            Authorization: "Basic " + util.getJiraKey(args)
          }
        }
      ).then(() => {
        renderData();
      }, error => {
        console.error('Failed to deregister the webhook');
        console.error(error);
        renderData({ message: 'Webhook deregistration failed' });
      });
    }).fail(function () {
      renderData({ message: 'Webhook deregistration failed' });
    });
  },

  /**
   * Handler for onExternalEvent event
   *
   * Check if the issue received from JIRA is of type 'Bug'
   * Create a ticket in Freshdesk with bug creators email and summary
   *
   * @param {object} payload - payload with the data from the third-party applications along with iparams and other metadata
   */
  onWebhookCallbackHandler: function (args) {
    if (args.data.issue.fields.issuetype.name === 'Bug') {
      $request.post(
        args.iparams.freshdesk_domain + "/api/v2/tickets",
        {
          headers: {
            Authorization: "Basic <%= encode(iparam.freshdesk_api_key) %>"
          },
          json: {
            status: 2,
            priority: 3,
            email: args.data.issue.fields.creator.emailAddress,
            subject: args.data.issue.fields.summary,
            description: args.data.issue.fields.summary
          }
        }
      ).then(() => {
        console.info('Ticket created successfully');
      }, error => {
        console.error('Ticket creation failed');
        console.error(error);
      });
    }
  }
};
