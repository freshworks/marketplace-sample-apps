$(document).ready(function() {
  app.initialized()
  .then(function(_client) {
    var client = _client;

    var eventCallback = function(event) {
      client.data.get("ticket")
      .then(function(data) {
        if(data.ticket.tags.length>0){
          event.helper.done();
        }
        else{
          event.helper.fail("Please make sure that at least one tag is attached to this ticket");
        }
      },
      function(error) {
         client.interface.trigger("showNotify", {type: "error", message: { title: "Error", description: "Error while trying to fetch data"}});
      });
    };

    client.events.on("ticket.closeTicketClick", eventCallback, {intercept: true});
  });
});
