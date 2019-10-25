// code to be executed when the properties of the ticket is changed.
var interceptEventCallback = function (event)
{
  // Use event.helper.getData() to get the event detail.
  var data = event.helper.getData();
  console.log(event.type, data); 
  //Sample output: ticket.propertyUpdate { changedAttributes: { status: { old:1, new:2 } } }

  // open a confirm dialog 
  client.interface.trigger('showConfirm', {
    title: 'Intercept Event', 
    message: 'Do you want to proceed?', 
    saveLabel: 'Yes', 
    cancelLabel: 'No'
  }).then(function(data) {
    if(data.message === 'Yes') {
      // proceed with the action (ex. Property update)
      // Use event.helper.done() to proceed with the action.
      event.helper.done();
    } else {
      // stop the action (ex. Property update)
      // Use event.helper.fail(<message>) to stop the action.
      event.helper.fail('Some parameters are missing.');
     }
  }, function(error) {
    event.helper.fail('Error in showConfirm');
  });
};

function eventCbk(event) {
  console.log('event - ',event.type, event.helper.getData());
}

$(document).ready( function() {
  app.initialized()
    .then(function(_client) {
      window.client = _client;
      // Initialize client
      client.events.on('app.activated', function() {

        //Data change events
        client.events.on('ticket.statusChanged', eventCbk);

        //Button Click events
        client.events.on('ticket.replyClick', eventCbk);

        //Intercept events
        client.events.on('ticket.propertiesUpdated', interceptEventCallback, { intercept : true });
      });
  });
});