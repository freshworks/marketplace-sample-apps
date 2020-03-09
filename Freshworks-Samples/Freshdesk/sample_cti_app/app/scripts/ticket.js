/**
 * To create a ticket with call notes for the call
 **/
function createTicketWithCallNotes(event) {
  const callEnded = event.data;
  const callDescription = callEnded ? $('#callNotesOnSummary').val().toString() : $('#callNotes').val().toString();
  const ticketDetails = {
    email: 'sample@samplemail.com',
    subject: 'Call with the customer',
    priority: 1,
    description: callDescription === "" ? "Ticket from call" : callDescription,
    status: 2
  }
  client.data.get("domainName").then(
    function (domain) {
      client.request.post('https://' + domain.domainName + "/api/v2/tickets",
        {
          headers: {
            Authorization: '<%= encode(iparam.freshdesk_api_key) %>'
          },
          json: ticketDetails,
          method: "POST"
        }).then((ticketData) => {
          console.info('Successfully created ticket in Freshdesk');
          showNotify('success', 'Successfully created a ticket.');
          if (callEnded) {
            $('#callSummaryScreen').hide();
            $('#dialpad').show();
          } else {
            callTicket = ticketData.response.id;
            $('#createTicket').text(`Go to ticket: #${callTicket.toString()}`);
          }
        }, error => {
          console.error('Error: Failed to create a ticket in Freshdesk');
          console.error(error)
          showNotify('danger', 'failed to create a ticket. Try again later.');
        })
    },
    function (error) {
      console.error('Error: Failed to create a ticket');
      console.error(error);
      showNotify('danger', 'failed to create a ticket. Try again later.');
    });
}

/**
 * To navigate the page to the given ticket
 *
 * @param {Event} event
 **/
function navigateToTicket(event) {
  const ticketId = Number.parseInt(event.data);
  client.interface.trigger("click", { id: "ticket", value: ticketId })
    .then().catch(function (error) {
      console.error('Error: Failed to move to ticket', ticketId);
      console.error(error);
    });
}
