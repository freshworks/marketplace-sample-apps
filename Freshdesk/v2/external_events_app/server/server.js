var request = require('request');
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
      request.post({
        url: args.iparams.jira_url + "/rest/webhooks/1.0/webhook",
        headers: {
          "Authorization": "Basic " + util.getJiraKey(args)
        },
        json: {
          url: targetUrl,
          name: "External events - Freshdesk Integration",
          events: ["jira:issue_created"],
          excludeIssueDetails : false
        }
      }, function(err, res, body){
        if (err) {
          renderData({ message: APP_REGISTRATION_ERR });
        }
        else {
          var result = body;
          $db.set('jiraWebhookId', { url : result.self }).done(function(){
            renderData();
          })
          .fail(function() {
            renderData({ message: APP_REGISTRATION_ERR });
          });
        }
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
      request.delete({
        url: data.url,
        headers: {
          Authorization: "Basic " + util.getJiraKey(args)
        }
      }, function(err){
        if (err) {
          return renderData({ message: APP_DEREGISTRATION_ERR });
        }
        renderData();
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
      request({
        url: args.iparams.freshdesk_domain + "/api/v2/tickets",
        headers: {
          Authorization: util.getFreshdeskKey(args)
        },
        json: {
          status: 2,
          priority: 3,
          email: args.data.issue.fields.creator.emailAddress,
          subject: args.data.issue.fields.summary,
          description: args.data.issue.fields.summary
        },
        method: "POST"
      }, function(err) {
        if (err) {
          return console.log('Ticket creation failed');
        }
        console.log('Ticket created successfully');
      });
    }
  }
};
