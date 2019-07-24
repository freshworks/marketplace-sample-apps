/**
 * @desc - Whenever an agent clicks on the send reply button in the ticket
 * details page, this app displays a success notification.
 */
let showNotification, showError, init, client;

$(document).ready(function () {
  init();
});

init = function () {
  console.log('App init invoked');
  app.initialized().then(function (_client) {
    showNotification(_client);
  }, function (err) {
    showError(err);
  });
}

showNotification = function (clientObj) {
  client = clientObj;
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
