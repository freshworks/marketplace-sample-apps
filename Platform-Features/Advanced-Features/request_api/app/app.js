$(document).ready( function() {
  app.initialized().then(function(client) {
    client.events.on('app.activated', function() {
      // sample code for RequestAPI 
      client.request.get('https://httpbin.org/get', { client : true })
        .then(
          function(data) {
            console.log('RequestAPI:', data);
          }, 
          function(error) {
            console.log('RequestAPI:', error);
          }
        );
    });
  });
});
