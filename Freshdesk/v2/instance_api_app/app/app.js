/**
 * @desc - This app demonstrates the usage of modals and Instance APIs
 * 1 - Using data API to get the ticket requester's details.
 * 2 - Using interface API to open up a modal and pass data to the modal.
 * 
 */

$(document).ready( () => {
  app.initialized().then((_client) => {
    let client = _client;
    client.events.on('app.activated', fireModal);

    function fireModal() {
      client.data.get('contact').then((data) => {
        $('#send-details').click(() => {
        /**
         * @fires - Interface API to show Modal and insert modal.html
         * Also, Data API to get requester's details
         *            */
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
    }

  });
});
