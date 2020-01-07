$(document).ready( function() {
  // Initialize channel
  app.initialized().then(function(_client) {
    var client = _client;
    // App activate callback
    client.events.on('app.activated', function() {
      // Disable Ticket Priority
      client.interface.trigger('disable', { id: 'priority'} );
    });
  });
});
