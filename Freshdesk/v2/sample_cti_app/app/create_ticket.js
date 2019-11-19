/**
 * Makes an API to Freshdesk to create a ticket for the call
 *
 * @param {Event} event - event instance to pass data between main window and modal window
 **/
function createTicket(event) {
  const ticketDetails = {
    email: $('#email').val(),
    subject: $('#subject').val(),
    priority: $('#priority').val(),
    description: $('#description').val(),
  }

  const priorities = {
    'low': 1,
    'medium': 2,
    'high': 3,
    'urgent': 4
  }

  event.data.client.data.get("domainName").then(
    function (data) {
      client.request.post(data.domainName + "/api/v2/tickets",
        {
          headers: {
            Authorization: '<%= encode(iparam.freshdesk_api_key) %>'
          },
          json: {
            priority: priorities[ticketDetails.priority],
            email: ticketDetails.email,
            subject: ticketDetails.subject,
            description: ticketDetails.description
          },
          method: "POST"
        }).then(() => {
          console.info('Successfully created ticket in Freshdesk');
        }, error => {
          console.error('Error: Failed to create ticket in Freshdesk');
          console.error(error);
        });
    },
    function (error) {
      console.error('Error: Failed to create ticket');
      console.error(error);
    });
}

function onDocumentReady() {
  app.initialized()
    .then(function (client) {
      client.instance.context().then(function (context) {
        $('#description').val(context.data.callNotes);

        $('#btnCreateTicket').on('click', { client: client }, createTicket);
      }).catch(function (error) {
        console.error('Error: Failed to create ticket due to error in loading the modal');
        console.error(error);
      });
    }).catch(function (error) {
      console.error('The app failed to get initialized');
      console.error(error);
    });
};

$(document).ready(onDocumentReady);
