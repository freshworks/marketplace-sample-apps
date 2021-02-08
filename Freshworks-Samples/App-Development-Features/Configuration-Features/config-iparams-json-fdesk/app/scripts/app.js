const URL = 'https://api.thecatapi.com/v1/images/search';

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
  var options = {
    headers: {
      'x-api-key': `<%= iparam.api_key %>` // substitution happens by platform
    }
  };

  client.request
    .get(URL, options)
    .then(function ({ response }) {
      let imageURL = JSON.parse(response)[0].url;
      document.querySelector('.catpicture').src = imageURL;
    })
    .catch(console.error);
}
