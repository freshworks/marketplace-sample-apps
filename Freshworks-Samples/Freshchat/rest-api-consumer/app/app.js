$(document).ready(function() {
  app.initialized().then(function(_client) {
    var client = _client;
    client.events.on("app.activated", function() {
      client.data
        .get("loggedInAgent")
        .then(function(data) {
          $("#apptext").text("Agent logged in is " + data.loggedInAgent.email);
        })
        .catch(function(e) {
          client.interface.trigger("showNotify", {
            type: "danger",
            message: "Unable to retrieve logged-in agent details"
          });
          console.log("Exception - ", e);
        });
    });
  });
});
