exports = {

  events: [
    { event : 'onTicketCreate', callback : 'onTicketCreateHandler'}
  ],

  onTicketCreateHandler : function(args) {
    $request.post('https://app.asana.com/api/1.0/workspaces/'+ args.iparams.asana_details.workspace_id + '/tasks?name=' + args.data.ticket.subject+ '&projects=' + args.iparams.asana_details.project_id, {
      headers : {
        'Authorization' : 'Bearer <%= access_token %>'
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
