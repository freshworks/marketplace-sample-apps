const REQUEST_TTL = 60000;

/**
 * Display notification through interface's showNotify
 */
function showNotification(type, message) {
  client.interface.trigger('showNotify', { type: type, message: message });
}

/**
 * Sends a GET request to httpbin with cache flag & ttl
 */
function makeRequest() {
  client.request.get('https://httpbin.org/uuid', {
    cache: true,
    ttl: REQUEST_TTL
  }).then(function(data) {
    const uuid = JSON.parse(data.response).uuid;

    console.log(`Received data - ${uuid}`);

    showNotification('success', uuid);
  }, function(error) {
    showNotification('error', error.response);
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
