/**
 * Get ticket data through Data API
 */
function getTicketData() {
  return client.data.get('ticket');
}

/**
 * Helper function to show notification
 */
function notify(status, message) {
  client.interface.trigger('showNotify', {
    type: status,
    message: message
  });
}

/**
 * Increment the visits for the current ticket
 */
function incrementCounter(data) {
  const ticketIdentifier = `ticket_${data.ticket.id}`;

  client.db.get(ticketIdentifier).then(function(activityData) {
    ++activityData.visits;

    notify('info', 'Tacking activity for old Ticket');

    client.db.set(ticketIdentifier, activityData);

  }, function(error) {
    if (error.status === 404) {
      notify('info', 'Tacking activity for new Ticket');
      client.db.set(ticketIdentifier, {
        visits: 1
      });
    }
  })
}

function trackActivity() {
  getTicketData()
  .then(incrementCounter);
}

$(document).ready(function() {
  app.initialized().then(function(_client) {
    window.client = _client;
    client.events.on('app.activated', trackActivity);
  });
});
