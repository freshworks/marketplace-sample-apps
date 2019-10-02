"use strict";

/**
 * @desc - This app intercepts the ticket close event and checks if there is
 * any timer running. If so, it rejects the close action and displays an
 * error message.
 */
// Function executed when the ticked is getting closed.
var timerValidation = function timerValidation(event) {
  client.data.get("ticket").then(
    function (ticketData) {
      var baseUrl = "https://<%= iparam.freshdesk_domain %>.freshdesk.com";
      var url = ""
        .concat(baseUrl, "/api/v2/tickets/")
        .concat(ticketData.ticket.id, "/time_entries");
      var options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic <%= encode(iparam.freshdesk_key + ':x') %>"
        }
      };

      client.request.get(url, options).then(
        function (data) {
          if (data.status === 200) {
            var response = JSON.parse(data.response);
            var runningTimer = response.filter(function (timeEntry) {
              return timeEntry.timer_running === true;
            });

            if (runningTimer.length > 0) {
              event.helper.fail(
                "Timer(s) running. Stop the timer(s) before proceeding to close the ticket."
              );
            } else {
              event.helper.done();
            }
          } else {
            handleErrors(data, event);
          }
        },
        function (e) {
          handleErrors(e, event);
        }
      );
    },
    function (e) {
      handleErrors(e, event);
    }
  );
};

var handleErrors = function handleErrors(e, event) {
  event.helper.fail(
    "Some Error occured in validating ticket close. Status: "
      .concat(e.status, " ")
      .concat(e.message)
  );
};

var propertiesUpdatedCallback = function propertiesUpdatedCallback(event) {
  // Use event.helper.getData() to get the event details.
  var data = event.helper.getData(); //Sample data: { changedAttributes: { status: { old:1, new:2 } } }
  // status changed to closed

  if (data.changedAttributes.status && data.changedAttributes.status[1] === 5) {
    timerValidation(event);
  } else {
    // Proceed with other properties update
    event.helper.done();
  }
};

$(document).ready(function () {
  app.initialized().then(function (client) {
    window.client = client;
    client.events.on("app.activated", function () {
      client.events.on("ticket.closeTicketClick", timerValidation, {
        intercept: true
      });
      client.events.on("ticket.propertiesUpdated", propertiesUpdatedCallback, {
        intercept: true
      });
    });
  });
});
