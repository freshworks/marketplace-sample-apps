"use strict";

/**
 * Notify user with message and type
 * @param {String} status - type of the notification
 * @param {String} message - content to be shown in the notification
 */
function notifyUser(status, message) {
  client.interface.trigger("showNotify", {
    type: status,
    message: message,
  });
}

/**
 * Send SMS notification to user with the given message and status
 */
function notifySMS() {
  var reqPhone = document.getElementById("to-number").value;
  var msgContent = document.getElementById("sms-message").value;

  if (!reqPhone) {
    return notifyUser("warning", "Please enter the recipient's mobile number");
  }
  client.request
    .invoke("sendSMS", {
      phone: reqPhone,
      message: msgContent,
    })
    .then(function () {
      notifyUser("success", "Message sent successfully.");
    })
    .catch(function (error) {
      notifyUser("danger", error.message || "Unexpected error.");
    });
}

/**
 * Render the application on click of the user notification SMS
 */
document.onreadystatechange = function () {
  if (document.readyState === "interactive") renderApp();

  function renderApp() {
    var onInit = app.initialized();

    onInit.then(getClient).catch(handleErr);

    function getClient(_client) {
      window.client = _client;
      client.events.on("app.activated", onAppActivate);
    }
  }
};

function onAppActivate() {
  document.getElementById("send-sms").addEventListener("click", notifySMS);

  client.data.get("contact").then(function (data) {
    if (data.contact.mobile) {
      document.getElementById("to-number").value = `+${data.contact.mobile}`;
    }
  }),
    function (error) {
      console.error("Error fetching contact data:", error);
    };
}

function handleErr(err) {
  console.error(`Error occurred. Details:`, err);
}
