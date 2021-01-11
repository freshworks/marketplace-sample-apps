/**
 * Voucher sample app for Freshchat
 *
 * This app can be invoked from the conversation message editor area. It is available as a 'voucher' icon below the editor.
 * Shows the voucher list from an API which can be directly added to the editor area
 */
document.addEventListener("DOMContentLoaded", function () {
  app.initialized()
    .then(onAppInitializedCallback)
    .catch(function (error) {
      //Log and notify initialization error
      console.error(error);
      showNotification("danger", "Unable to initialize the app");
    });
});
/**
 * Open the voucher dialog once the icon is clicked.
 * @param {*} _client
 */
function onAppInitializedCallback(_client) {
  window.client = _client;
  client.events.on('app.activated', function () {
    // Open the voucher dialog
    client.interface.trigger("showDialog", {
      title: "Vouchers",
      template: "dialog/dialog.html"
    })
      .catch(function (error) {
        // Log and Notify the agent/user that something went wrong while opening the dialog
        console.error(error);
        showNotification("danger", "Unable to open the dialog");
      });
  });
}

/**
 * Shows notification to the agent
 * @param {string} type
 * @param {string} message
 */
function showNotification(type, message) {
  client.interface.trigger("showNotify", {
    type: type || "alert",
    message: message || "NA"
  });
}
