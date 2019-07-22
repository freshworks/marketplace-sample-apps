/**
 * @desc - Sample App shows fectching Contact from Data API and shows on Ticket
 * sidebar
 */

$(document).ready(function () {
  app.initialized().then((_client) => {
    client = _client;
    client.events.on('app.activated', () => {
      getcontactdata(client);
    });
  });

  function getcontactdata(client) {
    client.data.get('contact').then((data) => {
      $('#apptext').text(`Ticket created by ${data.contact.name}`);
      congratulations();
    }, (e) => {
      console.log('Found some error. More info:', e);
    });
  }

  function congratulations() {
    $('.content').text(`Congratulations on creating your first app`);
  }
});
