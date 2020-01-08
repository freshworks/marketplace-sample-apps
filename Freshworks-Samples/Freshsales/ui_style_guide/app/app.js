$(document).ready( function() {
  app.initialized()
      .then(function(_client) {
        var client = _client;
        client.events.on("app.activated",
          function() {
              //Your code here
      });
  });
});
