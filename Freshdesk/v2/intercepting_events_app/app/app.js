/**
 * @desc - This app intercepts the ticket close event and checks if there is 
 * any timer running. If so, it rejects the close action and displays an 
 * error message.
 */

// Function executed when the ticked is getting closed.
var timerValidation = function (event)
{
  client.data.get('ticket').then(function(ticketData) { // to get the ticket id
      // request api to get time_entries for the ticket
      const baseUrl = `https://<%= iparam.freshdesk_domain %>.freshdesk.com`;
      const url = `${baseUrl}/api/v2/tickets/${ticketData.ticket.id}/time_entries`;
      const options = {
        "headers" : {
          "Content-Type": "application/json",
          "Authorization": "Basic <%= encode(iparam.freshdesk_key + ':x') %>"
        } 
      };
      
      // to load all time-entries for the ticket
      // @info: https://developers.freshdesk.com/v2/docs/request-api/
      client.request.get(url, options).then((data) => {
        if (data.status === 200) {
          const response = JSON.parse(data.response);
          const runningTimer = response.filter((timeEntry) => {
            return timeEntry.timer_running === true;
          });

        if(runningTimer.length > 0) { // Timer(s) currently running. Reject ticket close
            event.helper.fail('Timer(s) running. Stop the timer(s) before proceeding to close the ticket.');
          } else {
            event.helper.done();// No Timer(s) currently running. Proceed with ticket close
          }
        } 
          else {handleErrors(data, event);}
      }, (e) => {handleErrors(e, event);}
      );
  }, (e) => {handleErrors(e, event); }
  );
};

var handleErrors = (e, event) => {
  event.helper.fail(`Some Error occured in validating ticket close. Status: ${e.status} ${e.message}`);
};

var propertiesUpdatedCallback = (event) => {
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

$(document).ready(() => {
  app.initialized().then((client) => {
    window.client = client;
    client.events.on('app.activated', () => {
      client.events.on('ticket.closeTicketClick', timerValidation, { intercept : true });
      client.events.on('ticket.propertiesUpdated', propertiesUpdatedCallback, { intercept : true });
    });
  });
});

