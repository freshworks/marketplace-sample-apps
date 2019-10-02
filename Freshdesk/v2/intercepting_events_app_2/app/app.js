"use strict";

/**
 * @description - Whenever a ticket is expected to be closed, this app checks
 * if there are any tags attached to the ticket, Upon no tags, it halts the close
 * event and displays an error notification.
 *
 *  - Using data API to fetch the ticket's data.
 *  - Using intercept APIs to check and stop the close action if there are no
 * tags attached to the ticket.
 *
 */
$(document).ready(function () {
  app.initialized().then(function (_client) {
    window.client = _client;

    var checkTags = function checkTags(event) {
      client.data.get("ticket").then(function (data) {
        if (data.ticket.tags.length > 0) {
          event.helper.done();
        } else {
          event.helper.fail("Please add atleast one tag!");
        }
      }, errorHandler);
    };

    client.events.on("ticket.closeTicketClick", checkTags, {
      intercept: true
    });

    var errorHandler = function errorHandler(err) {
      client.interface.trigger("showNotify", {
        type: "error",
        message: {
          title: "Error",
          description: "Error while trying to fetch data"
        }
      });
      console.error("Error information:" + err);
    };
  });
});
