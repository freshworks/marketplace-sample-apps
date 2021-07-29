/**
 * App Initializer
 */
document.addEventListener("DOMContentLoaded", function () {
  app
    .initialized()
    .then(function (_client) {
      window.client = _client;
      showNotification("danger", "Sorry! Unable to load app");

      //Registers componenet event, All custom events for the components has to be regisered like below
      document
        .getElementById("openModal")
        .addEventListener("fwClick", openModal);
    })
    .catch(function (error) {
      showNotification("danger", "Sorry! Unable to load app");
    });
});

/**
 * Function to Open App in Modal
 */
function openModal() {
  client.interface.trigger("showModal", {
    title: "Github Issue Details",
    template: "./views/modal.html",
  });
}

/**
 * Show notifications to the user using interface - notification API
 * @param {string} type Type of notification
 * @param {string} title Title of the message
 * @param {string} message Content of the notification message
 */
function showNotification(type, title, message) {
  client.interface
    .trigger("showNotify", {
      type: `${type}`,
      title: `${title}`,
      message: `${message}`,
    })
    .catch(function (error) {
      console.error("Notification Error : ", error);
    });
}
