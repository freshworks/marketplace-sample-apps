$(document).ready( function() {
  app.initialized()
  .then(function(_client) {
    var client = _client;
    client.events.on('app.activated', function() {
      client.data.get('contact')
      .then(function(data) {
        $('#send-details').click(function() {
          client.interface.trigger("showModal", {
            title: "Contact Form",
            template: "modal.html",
            data: {
              name: data.contact.name,
              email: data.contact.email
            }
          });
        });
      });
    });
  });
});
