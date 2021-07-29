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
        createFreshdeskTicket(title, desc, email);
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
 * 1.2 Function to create a Freshdesk ticket ! 🤘
 * @param {String} title          Ticket title
 * @param {String} description    Ticket description
 * @param {String} email          email of the user that creates ticket
 */
function createFreshdeskTicket(title, description, email) {
  client.iparams
    .get("freshdesk_subdomain")
    .then(function (iparam) {
      client.request
        .post(
          `https://${iparam.freshdesk_subdomain}.freshdesk.com/api/v2/tickets`,
          {
            headers: {
              Authorization: "Basic <%= encode(iparam.freshdesk_api_key)%>",
              "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
              description: `${description}`,
              email: `${email}`,
              priority: 1,
              status: 2,
              subject: `${title}`,
            }),
          }
        )
        .then(function () {
          showNotification("success", "Ticket is successfully created");
          //Clears user input after posting data
          clearInputfields();
        })
        .catch(function (error) {
          console.error(error);
          showNotification("danger", "Unable to create ticket");
        });
    })
    .catch(function (error) {
      console.error(error);
      showNotification("danger", "Unable to get iparams");
    });
}

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
