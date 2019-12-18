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
 * Add listeners for elements
 */
function addListeners(ticketIdentifier) {
  $('#set-status').click(function() {
    client.db.update(ticketIdentifier, 'set', {"active": true}).then(function() {
      notify('success', 'Status has been set');
    }, function() {
      notify('danger', 'Failed to set status');
    })
  });

  $('#remove-status').click(function() {
    client.db.update(ticketIdentifier, 'remove', ['active']).then(function() {
      notify('success', 'Status has been removed');
    }, function() {
      notify('danger', 'Failed to remove status');
    })
  });
}

/**
 * Display information about current ticket
 */
function displayData(ticketIdentifier) {
  client.db.get(ticketIdentifier).then(function(activityData) {
    $('#visits').text(`Visits: ${activityData.visits}`);
    $('#status').text(activityData.active ? 'Active': 'InActive');
  }, function() {
    notify('warning', 'No Tracking data');
  });
}

function activateApp() {
  getTicketData().then(function(data) {
    const ticketIdentifier = `ticket_${data.ticket.id}`;

    addListeners(ticketIdentifier);
    displayData(ticketIdentifier);
  });
}

$(document).ready(function() {
  app.initialized().then(function(_client) {
    window.client = _client;
    client.events.on('app.activated', activateApp);
  });
});
