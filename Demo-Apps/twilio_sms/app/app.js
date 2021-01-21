'use strict';

/**
 * Notify user with message and type
 * @param {String} status - type of the notification
 * @param {String} message - content to be shown in the notification
 */
function notifyUser(status, message) {
  client.interface.trigger('showNotify', {
    type: status,
    message: message
  });
}

/**
 * Send SMS notification to user with the given message and status
 */
function notifySMS(event) {
  var req_phone = document.getElementById('to').value;
  var msgContent = document.getElementById('sms_message').value;

  if (!req_phone) {
    return notifyUser('warning', 'Please enter the recipient\'s mobile number');
  }

  client.request.invoke('sendSMS', {
    phone: req_phone,
    message: msgContent
  }).then(function (data) {
    notifyUser('success', 'Message sent successfully.');
  })
    .catch(function (error) {
      notifyUser('danger', error.message || 'Unexpected error.');
    });
}

/**
 * Render the application on click of the user notification SMS
 */
function renderApp() {
  document.getElementById('send_sms').addEventListener('click', notifySMS);

  client.data
    .get('contact')
    .then(function (data) {
      if (data.contact.mobile) {
        document.getElementById('to').value = data.contact.mobile;
      }
    });
}

window.addEventListener('load', function () {
  app.initialized().then(function (client) {
    window.body = document.querySelector('body');
    window.client = client
    renderApp();
  });
});
