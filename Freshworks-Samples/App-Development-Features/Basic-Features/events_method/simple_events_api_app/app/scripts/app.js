"use strict";

/**
 * @desc - Whenever an agent clicks on the send reply button in the ticket
 * details page, this app displays a success notification.
 */

document.addEventListener("DOMContentLoaded", init);

var showNotification = function () {
  const notifyReply = function () {
    client.interface.trigger("showNotify", {
      type: "success",
      message: {
        title: "Success",
        description: "Your message has been sent"
      },
    });
  }
  client.events.on("ticket.sendReply", notifyReply);
}

var showError = function (err) {
  client.interface.trigger("showNotify", {
    type: "warning",
    message: {
      title: "Failed to connect",
      description: "Your message has not been sent. Some error occured"
    }
  });
  console.error("Error".concat(JSON.stringify(err)));
};


var init = function () {
  app.initialized().then(function (_client) {
    var client = _client;
    showNotification(client);
  }, function (err) {
    showError(err);
  });
}
