document.onreadystatechange = whenInteractive;
document.querySelector('.getBtn').onclick = makeAPIcall;

function whenInteractive() {
  if (document.readyState === 'interactive') {
    return app.initialized().then(getClientAPI).catch(console.error);
  }
}

function getClientAPI(_client) {
  window.client = _client;
  // For apps those run in background,the callback is invoked everytime page is opened by the Freshdesk Agent.
  client.events.on('app.activated', makeAPIcall);
}

function makeAPIcall() {
  const URL = 'https://<%= iparam.creatorDomain %>.freshdesk.com/api/v2/contacts';
  var options = {
    headers: {
      'Authorization': `Basic <%= encode(iparam.api_key) %>`, // substitution happens by platform
      'Content-Type': 'application/json'
    }
  };

  console.log('url', URL, 'optoins', options);
  client.request
    .get(URL, options)
    .then(function ({ response }) {
      console.log(response);
    })
    .catch(console.error);
}
