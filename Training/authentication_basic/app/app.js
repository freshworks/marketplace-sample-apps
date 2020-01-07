$(document).ready( function() {
  app.initialized().then(function(client) {
    window.client = client;
    client.events.on('app.activated', function() {
      client.request.get('https://<%= iparam.subdomain %>.freshdesk.com/api/v2/search/tickets?query="tag:%27sample%27"', {
        auth: {
          user: '<%= iparam.username %>',
          pass: '<%= iparam.password %>',
          sendImmediately: true
        }
      }).then(function(data) {
        let html = '';
        JSON.parse(data.response).results.forEach(function(result) {
          console.log(result);
          html += `<li>${result.subject}</li>`;
        });
        $('#content').html(`<ul>${html}</ul>`);
      });
    });
  });
});
