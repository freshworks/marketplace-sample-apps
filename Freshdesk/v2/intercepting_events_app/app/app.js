// Function executed when the ticked is getting closed.
var timerValidation = function (event)
{
  client.data.get('ticket').then(function(ticketData) { // to get the ticket id
    // request api to get time_entries for the ticket
    var baseUrl = `https://<%= iparam.freshdesk_domain %>.freshdesk.com`;
    var url = `${baseUrl}/api/v2/tickets/${ticketData.ticket.id}/time_entries`;
    var options = {
      "headers" : {
        "Content-Type": "application/json",
        "Authorization": "Basic <%= encode(iparam.freshdesk_key + ':x') %>"
      }
    };
    // to load all time-entries for the ticket
    client.request.get(url, options).then(function(data) {
      if (data.status === 200) {
        var response = JSON.parse(data.response);
        var runningTimer = response.filter(function(timeEntry) {
          return timeEntry.timer_running === true;
        });
        if(runningTimer.length > 0) { // Timer(s) currently running. Reject ticket close
          event.helper.fail('Timer(s) running. Stop the timer(s) before proceeding to close the ticket.');
        } else {
          event.helper.done();// No Timer(s) currently running. Proceed with ticket close
        }
      } else {
        handleErrors(data, event);
      }
    }, function(e) {
      handleErrors(e, event); 
    });
  }, function(e) {
    handleErrors(e, event); 
  });
};

var handleErrors = function(e, event) {
  event.helper.fail(`Some Error occured in validating ticket close. Status: ${e.status} ${e.message}`);
};

var propertiesUpdatedCallback = function(event) {
  // Use event.helper.getData() to get the event detail.
  var data = event.helper.getData();
  //Sample data: { changedAttributes: { status: { old:1, new:2 } } }

  // status changed to closed
  if(data.changedAttributes.status && data.changedAttributes.status[1] === 5) {
    timerValidation(event);
  } else {
    // Proceed with other properties update
    event.helper.done();
  }
};

$(document).ready( function() {
  app.initialized().then(function(client) {
    window.client = client;
    client.events.on('app.activated', function() {
      client.events.on('ticket.closeTicketClick', timerValidation, { intercept : true });
      client.events.on('ticket.propertiesUpdated', propertiesUpdatedCallback, { intercept : true });
    });
  });
});
