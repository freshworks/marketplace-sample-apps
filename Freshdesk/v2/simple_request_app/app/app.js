var BASE_URL = "https://httpbin.org/";

function displayStatus(type, message) {
  client.interface.trigger('showNotify', { type: type, message: message});
}

$(document).ready( function() {
  app.initialized()
  .then(function(_client) {
    window.client = _client;
    client.events.on('app.activated', function() {
      jQuery(".request-btn").click(function(e) {
        var method = e.target.getAttribute('method');
        var url = BASE_URL + method;
        var options = {
          "headers" : {
            "Content-Type": "application/json"
          }
        };
        client.request[method](url, options)
        .then(function() {
          displayStatus('success', method.toUpperCase() + ' request successful.');
        }, function() {
          displayStatus('danger', method.toUpperCase() + ' request failed.');
        });
      });
    });
  });
});
