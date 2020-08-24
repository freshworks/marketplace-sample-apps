const MAX_ATTEMPTS = 3;
const RETRY_DELAY = 500;

/**
 * Display notification through interface's showNotify
 */
function showNotification(type, message) {
  client.interface.trigger('showNotify', { type: type, message: message });
}

/**
 * Sends a GET request to httpbin with maxAttempts & retryDelay
 */
function makeRequest() {
  client.request.get('https://httpbin.org/status/200', {
    maxAttempts: MAX_ATTEMPTS,
    retryDelay: RETRY_DELAY,
  }).then(function(data) {
    showNotification('success', `Request succeeded with - ${data.attempts} attempt(s)`);
  }, function(error) {
    showNotification('error', `Request failed with - ${error.attempts} attempt(s)`);
  });
}

/**
 * Event listeners
 */
function addEventListeners() {
  $('#b-request').click(function() {
    makeRequest();
  });
}

$(document).ready(function() {
  app.initialized().then(function(client) {
    window.client = client;

    addEventListeners();
  });
});
