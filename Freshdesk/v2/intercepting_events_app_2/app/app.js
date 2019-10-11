"use strict";

$(document).ready(function () {
  app.initialized().then(function (_client) {
    var client = _client;

    var eventCallback = function eventCallback(event) {
      /** @fires - Data API */
      client.data.get("ticket").then(
        function (data) {
          /** If there is atleast 1 tag, allow the original event to continue */
          if (data.ticket.tags.length > 0) {
            event.helper.done();
          } else {
            event.helper.fail("Please make sure that at least one tag is attached to this ticket");
          }
        },
        function (error) {
          client.interface.trigger("showNotify", {
            type: "error",
            message: {
              title: "Error",
              description: "Error while trying to fetch data"
            }
          });
          console.error(error);
        }
      );
    };

    client.events.on("ticket.closeTicketClick", eventCallback, {
      intercept: true
    });
  });
});
