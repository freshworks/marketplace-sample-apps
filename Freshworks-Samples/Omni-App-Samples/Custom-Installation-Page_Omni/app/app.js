var client;
$(document).ready(function () {
  app.initialized().then(function (_client) {
    client = _client;
    client.events.on("app.activated", function () {
      //Your code here
    });
  });
});
