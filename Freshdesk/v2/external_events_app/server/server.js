var util = require('./lib/util');

var APP_REGISTRATION_ERR = 'App registration failed';
var APP_DEREGISTRATION_ERR = 'App deregistration failed';

exports = {

  events: [
    { event: 'onAppInstall', callback: 'onInstallHandler' },
    { event: 'onAppUninstall', callback: 'onUnInstallHandler' },
    { event: 'onExternalEvent', callback: 'onWebhookCallbackHandler'}
  ],

  /**
   * onAppInstall:
   * Webhook url is created through generateTargetUrl function
   * The generated url is registered with jira for "issue_created" event and the same is triggered when an issues is created.
   * On successful registration, the id is stored using $db
   */
  onInstallHandler: function(args) {
    generateTargetUrl().done(function(targetUrl) {
      $request.post(
        args.iparams.jira_url + "/rest/webhooks/1.0/webhook",
        {
          headers: {
            "Authorization": "Basic " + util.getJiraKey(args)
          }, 
          body: {
            url: targetUrl,
            name: "External events - Freshdesk Integration",
            events: ["jira:issue_created"],
            excludeIssueDetails : false  
          }
        }
      )
      .then((data) => {
        $db
          .set('jiraWebhookId', { url : data.self })
          .done(() => {
            renderData();
          })
          .fail(() => {
            renderData({ message: APP_REGISTRATION_ERR });
          })
      }, (error) => {
        renderData({ message: APP_REGISTRATION_ERR });
      });
    })
    .fail(function(){
      renderData({ message: APP_REGISTRATION_ERR });
    });
  },

  /**
   * onAppUninstall:
   * Get the webhook id from database through $db that was stored during installation
   * Deregister the webhook from jira with the id
   */
  onUnInstallHandler: function(args) {
    $db.get('jiraWebhookId').done(function(data){
      $request.delete(
        data.url,
        {
          headers: {
            Authorization: "Basic " + util.getJiraKey(args)
          }
        }
      )
      .then((data) => {
        renderData();
      }, (error) => {
        renderData({ message: APP_DEREGISTRATION_ERR });
      });
    })
    .fail(function(){
      renderData({ message: APP_DEREGISTRATION_ERR });
    });
  },

  /**
   * onExternalEvent:
   * Check if the received issue is of type 'Bug'
   * Create a ticket in freshdesk with bug creators email and summary
   */
  onWebhookCallbackHandler: function(args) {
    if (args.data.issue.fields.issuetype.name == 'Bug') {
      $request.post(
        args.iparams.freshdesk_domain + "/api/v2/tickets",
        {
          headers: {
            Authorization: util.getFreshdeskKey(args)  
          },
          body: {
            status: 2,
            priority: 3,
            email: args.data.issue.fields.creator.emailAddress,
            subject: args.data.issue.fields.summary,
            description: args.data.issue.fields.summary  
          }
        }
      ).then((data) => {
        console.log('Ticket created successfully');
      }, (error) => {
        console.log('Ticket creation failed');
      });
    }
  }
};
