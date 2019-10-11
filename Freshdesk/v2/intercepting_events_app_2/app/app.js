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

$(document).ready(() => {
  app.initialized().then((_client) => {
    let client = _client;
    let eventCallback = function (event) {
      /** @fires - Data API */
      client.data.get("ticket").then((data) => {
        /** If there is atleast 1 tag, allow the original event to continuve */
        if (data.ticket.tags.length > 0) {
          event.helper.done();
        }
        else {
          event.helper.fail("Please make sure that at least one tag is attached to this ticket");
        }
      },
        (error) => {
          client.interface.trigger("showNotify", { type: "error", message: { title: "Error", description: "Error while trying to fetch data" } });
        });
    };

    client.events.on("ticket.closeTicketClick", eventCallback, { intercept: true });
  });
});
