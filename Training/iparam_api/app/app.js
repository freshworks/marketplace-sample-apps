$(document).ready( function() {
  // Initialize client
  app.initialized().then(function(_client) {
    client.events.on('app.activated', function() {
      var client = _client;

      // Iparam get specific iparam
      client.iparams.get('contact').then(function(iparam) {
        console.log('Iparam::get specific::contact', iparam.contact);
      }, function(err) {
        console.log('Error', err);
      });

      // Iparam get all iparams
      client.iparams.get().then(function(iparam) {
        console.log('Iparam::Get All', iparam);
      }, function(err) {
        console.log('Error', err);
      });
    });
  });
});