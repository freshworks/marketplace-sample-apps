exports = {

/**
 * @desc - 
 * 
 * This app makes a API request to create a new task in the selected workspace (project) during installation.
 * This app does not have any page to show up in the support portal, it works as a backround service which will
 * do the task creating action in the background whenever a ticket is created in Freshdesk.
 * 
 * Product events with corresponding callback functions to perform an action is registered as follows.
 */

  events: [
    { event : 'onTicketCreate', callback : 'onTicketCreateHandler'}
  ],

/**
 * In the following event listerner method, workspace_id and project_id have been taken from installation parameters.
 * Subject of the ticket is an attribute of ticket object in the payload from the event trigger.
 */

  onTicketCreateHandler : function(payload) {
    $request.post('https://app.asana.com/api/1.0/workspaces/'
    + payload.iparams.asana_details.workspace_id
    + '/tasks?name=' + payload.data.ticket.subject
    + '&projects=' + payload.iparams.asana_details.project_id, {
      headers : {
        'Authorization' : 'Bearer <%= access_token %>' // Here, access_token is passed safely which is a secure installation parameter
      },
      isOAuth : true,
      json: {}
    })

    .then(function(data)  {
      console.log('Successfully created task in asana' + JSON.stringify(data));
    },

    function(err) {
      console.log('Unable to create task in asana' + JSON.stringify(err));
    });
  }
};
