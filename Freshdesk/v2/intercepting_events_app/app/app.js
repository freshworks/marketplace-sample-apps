/**
 * @desc - This app intercepts the ticket close event and checks if there is
 * any timer running. If so, it rejects the close action and displays an
 * error message.
 */

$(document).ready(() => {
  app.initialized().then((client) => {
    window.client = client;
    client.events.on('app.activated', () => {
      client.events.on('ticket.closeTicketClick', timerValidation, { intercept: true });
      client.events.on('ticket.propertiesUpdated', propertiesUpdatedCallback, { intercept: true });
    });
  });
});

// Function executed when the ticked is getting closed.
let timerValidation = function (event) {
  client.data.get('ticket').then(function (ticketData) {
    const baseUrl = `https://<%= iparam.freshdesk_domain %>.freshdesk.com`;
    const url = `${baseUrl}/api/v2/tickets/${ticketData.ticket.id}/time_entries`;
    const options = {
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Basic <%= encode(iparam.freshdesk_key + ':x') %>"
      }
    };

    client.request.get(url, options).then((data) => {
      if (data.status === 200) {
        const response = JSON.parse(data.response);
        const runningTimer = response.filter((timeEntry) => {
          return timeEntry.timer_running === true;
        });

        if (runningTimer.length > 0) {
          event.helper.fail('Timer(s) running. Stop the timer(s) before proceeding to close the ticket.');
        } else {
          event.helper.done();
        }
      }
      else { handleErrors(data, event); }
    }, (e) => { handleErrors(e, event); });
  }, (e) => { handleErrors(e, event); });

};

let propertiesUpdatedCallback = (event) => {
  var data = event.helper.getData();
  if (data.changedAttributes.status && data.changedAttributes.status[1] === 5) {
    timerValidation(event);
  } else {
    event.helper.done();
  }
};

let handleErrors = (e, event) => {
  event.helper.fail(`Some Error occured in validating ticket close. Status: ${e.status} ${e.message}`);
};
