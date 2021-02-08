const APIKEY = '2586e690-54ce-43e1-a934-692cbe5c6a97';
const URL = 'https://api.thecatapi.com/v1/images/search';

document.onreadystatechange = whenInteractive;

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
      'x-api-key': APIKEY
    }
  };

  client.request
    .get(URL, options)
    .then(function (data) {
      console.log(data);
    })
    .catch(console.error);
}
