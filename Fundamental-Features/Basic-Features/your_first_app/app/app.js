/**
 * @desc - Sample App shows fectching Contact from Data API and shows on Ticket
 * sidebar
 */

$(document).ready(function() {
  app.initialized().then(function(_client) {
    const client = _client;
    client.events.on('app.activated', function () {
      getContactData(client);
    });
  });

  function getContactData(client) {
    client.data.get('contact').then(function (data) {
      $('#apptext').text(`Ticket created by ${data.contact.name}`);
      congratulations();
    });
  }

  function congratulations() {
    $('.content').text(`Congratulations on creating your first app`);
  }
});
