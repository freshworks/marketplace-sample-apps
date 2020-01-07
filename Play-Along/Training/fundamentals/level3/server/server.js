'use strict';

/**
 * Store Github issue data in the data storage
 *
 * @param {Object} data - Issue data to be stored
 */
//👇 Paste code for saveMapping() here 👇 - 🚩

/**
 * Get Github issue data with issue number from the data storage
 *
 * @param {number} issueNumber - GitHub issue number to be searched
 */
function lookupTicketId(issueNumber) {
  var dbKey = String(`gitIssue:${issueNumber}`).substr(0, 30);
  return $db.get(dbKey)
}

exports = {

  events: [
    { event: 'onAppInstall', callback: 'onInstallHandler' },
    { event: 'onAppUninstall', callback: 'onUnInstallHandler' },
    { event: 'onExternalEvent', callback: 'onExternalEventHandler' },
    { event: "onTicketCreate", callback: "onTicketCreateHandler" }
  ],

  /**
   * Handler for onTicketCreate event
   *
   * A GitHub issue is created based on the ticket details from the payload received in the function argument
   *
   * @param {object} args - payload
   */
   //👇 Paste code for onTicketCreateHandler() here 👇- 🚩

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
    generateTargetUrl().then(function (targetUrl) {
      $request.post(`https://api.github.com/repos/${args.iparams.github_repo}/hooks`, {
        headers: {
          Authorization: 'token <%= access_token %>',
          'User-Agent': 'FreshHuddle Sample User Agent'
        },
        isOAuth: true,
        json: {
          name: 'web',
          active: true,
          events: [
            'issues'
          ],
          config: {
            url: targetUrl,
            content_type: 'json'
          }
        }
      }).then(data => {
        $db.set('githubWebhookId', { url: data.response.url }).then(function () {
          console.info('Successfully stored the webhook in the db');
          renderData();
        }, error => {
          console.error('Error: Failed to store the webhook URL in the db');
          console.error(error);
          renderData({ message: 'The webhook registration failed' });
        });
      }, error => {
        console.error('Error: Failed to register the webhook for GitHub repo');
        console.error(error);
        renderData({ message: 'The webhook registration failed' });
      })
    })
      .fail(function () {
        console.error('Error: Failed to generate the webhook');
        renderData({ message: 'The webhook registration failed' });
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
  onUnInstallHandler: function () {
    $db.get('githubWebhookId').then(function (data) {
      $request.delete(data.url, {
        headers: {
          Authorization: 'token <%= access_token %>',
          'User-Agent': 'freshdesk',
          Accept: 'application/json'
        },
        isOAuth: true
      }).then(() => {
        console.info('Successfully deregistered the webhook for GitHub repo');
        renderData();
      }, () => renderData())
    }, error => {
      console.error('Error: Failed to get the stored webhook URL from the db');
      console.error(error)
      renderData({ message: 'The webhook deregistration failed' });
    });
  },

  /**
   * Handler for onExternalEvent event
   *
   * Checks if the received issue event is of action 'opened' which is received for new issue creation.
   * Creates a ticket in freshdesk with the issue title and description.
   *
   * @param {object} payload - payload with the data from the third-party applications along with iparams and other metadata
   */
  onExternalEventHandler: function (payload) {
    const payloadData = typeof payload.data === 'string' ? JSON.parse(payload.data) : payload.data;
    if (payloadData.action === 'closed') {
      lookupTicketId(payloadData.issue.number).then(data => {
        $request.post(payload.domain + "/api/v2/tickets/" + data.issue_data.ticketID,
          {
            headers: {
              Authorization: '<%= encode(iparam.freshdesk_api_key) %>'
            },
            json: {
              status: 5
            },
            method: "PUT"
          }).then(() => {
            console.info('Successfully closed the ticket in Freshdesk');
          }, error => {
            console.error('Error: Failed to close the ticket in Freshdesk');
            console.error(error)
          })
      }, error => {
        console.error('Error: Failed to get issue data. Unable to create ticket');
        console.error(error);
      });
    } else {
      console.error('The action of the GitHub issue is not defined');
    }
  }
};
