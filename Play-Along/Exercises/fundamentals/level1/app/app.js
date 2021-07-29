document.addEventListener("DOMContentLoaded", function () {
  app
    .initialized()
    .then(function (_client) {
      window.client = _client;
      client.events.on("app.activated", function () {
        onLoadClickEventHandler();
      });
    })
    .catch(function (error) {
      console.error(error);
      showNotification("danger", "Sorry! Unable to load app");
    });
});

/**
 *   Register click event handler for `Create Ticket` button
 */
function onLoadClickEventHandler() {
  document
    .getElementById("createTicket")
    .addEventListener("click", function () {
      // Ticket title fetched from user Input
      var title = document.getElementById("title").value;
      // Description of the ticket fetched from user input
      var desc = document.getElementById("desc").value;
      // Email id of the user, creating the ticket
      var email = document.getElementById("email").value;
      if (title && desc && email) {
        //createFreshdeskTicket(title, desc, email);
      } else {
        showNotification(
          "danger",
          "Ticket Values cannot empty, Fill all values"
        );
      }
    });
}

// 1.2 Paste the code for createFreshdeskTicket() here 👇🏼 !

/**
 * Function to show notifications to the user
 * @param {String} status   	Status of the notification
 * @param {String} message  	Custom notification message
 */
function showNotification(status, message) {
  client.interface.trigger("showNotify", {
    type: `${status}`,
    message: `${message}`,
  });
}

/**
 * Clear the input fields
 */
function clearInputfields() {
  document.getElementById("title").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("email").value = "";
}
