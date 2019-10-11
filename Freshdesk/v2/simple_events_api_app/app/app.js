/**
 * @desc - Whenever an agent clicks on the send reply button in the ticket
 * details page, this app displays a success notification.
 */

$(document).ready(function () {
  init();
});

let init = function () {
  console.info('App init invoked');
  app.initialized().then(function (_client) {
    var client = _client;
    showNotification(client);
  }, function (err) {
    showError(err);
  });
}

showNotification = function () {
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

showError = function (err) {
  client.interface.trigger("showNotify", {
    type: "warning",
    message: {
      title: "Failed to connect",
      description: `Error: Your message has not been sent. The error is ${JSON.stringify(err)}`
    }
  });
}
