'use strict';

function notifyUser(status, message) {
  client.interface.trigger('showNotify', {
    type: status,
    message: message
  });
}

function notifySMS(event) {
  var req_phone = body.find('#to').val();
  var msgContent = body.find('#sms_message').val();

  if (!req_phone) {
    return notifyUser('warning', 'Please enter the recipient\'s mobile number');
  }

  client.request.invoke('sendSMS', {
    phone: req_phone,
    message: msgContent
  }).then(function(data) {
    notifyUser('success', 'Message sent successfully.');
  })
  .catch(function(error) {
    notifyUser('danger', error.message || 'Unexpected error.');
  });
}

function renderApp() {
    body.find('#send_sms').on('click', notifySMS);

    client.data
          .get('contact')
          .then(function(data) {
            if (data.contact.mobile) {
              body.find('#to').val(data.contact.mobile);
            }
          });
}

window.addEventListener('load', function() {
  app.initialized().then(function(client) {
    window.body = $('body');
    window.client = client
    renderApp();
  });
});