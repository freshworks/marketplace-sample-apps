$(document).ready( function() {
  app.initialized()
  .then(function(_client) {
    var client = _client;

    var eventCallback = function (event) {
      client.interface.trigger("showNotify", {
        type: "success",
        message: {
          title: "Success",
          description: "Your message has been sent"
        }
      });
    };

    client.events.on("ticket.sendReply", eventCallback);
  });
});
