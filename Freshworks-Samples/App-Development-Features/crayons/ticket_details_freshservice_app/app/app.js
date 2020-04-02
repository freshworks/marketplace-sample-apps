$(document).ready(function () {
  app.initialized()
    .then(
      function (_client) {
        window.client = _client;
        client.events.on('app.activated', function () {

          document.getElementById("openModal").addEventListener("fwClick", openModal);
        }, function () {
          showNotification('danger', 'App cannot be activated, Please try later');
        });
      },
      function () {
        showNotification('danger', 'Sorry! Unable to load app');
      })
});

/**
 * Opens Modal on compoenent click
 */
function openModal() {
  client.interface.trigger("showModal", {
    title: "Ticket Details",
    template: "content.html"
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
    message: `${message}`
  });
}