"use strict";

/**
 * @desc - Whenever an agent clicks on the send reply button in the ticket
 * details page, this app displays a success notification.
 */
var showNotification, showError, client;
$(document).ready(function () {
  init();
});

var init = function init() {
  console.info("App init invoked");
  app.initialized().then(
    function (_client) {
      client = _client;
      showNotification(client);
    },
    function (err) {
      showError(err);
    }
  );
};

showNotification = function showNotification() {
  var notifyReply = function notifyReply() {
    client.interface.trigger("showNotify", {
      type: "success",
      message: {
        title: "Success",
        description: "Your message has been sent"
      }
    });
  };

  client.events.on("ticket.sendReply", notifyReply);
};

showError = function showError(err) {
  client.interface.trigger("showNotify", {
    type: "warning",
    message: {
      title: "Failed to connect",
      description: "Your message has not been sent. Some error occured"
    }
  });
  console.error("Error".concat(JSON.stringify(err)));
};
