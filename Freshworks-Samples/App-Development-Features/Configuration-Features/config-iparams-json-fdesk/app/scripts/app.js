const JOKE_ENDPOINT = 'https://official-joke-api.appspot.com/random_joke';

document.onreadystatechange = whenInteractive;

function whenInteractive() {
  if (document.readyState === 'interactive') {
    return app.initialized().then(renderJoke).catch(console.error);
  }
  function renderJoke(data) {
    let client = data;
    let response;

    client.events.on('app.activated', writeJoke);
    client.request
      .get(JOKE_ENDPOINT)
      .then(function (data) {
        writeJoke(JSON.parse(data.response));
      })
      .catch(console.error);

    function writeJoke(joke = response) {
      document.querySelector('.question').textContent = joke.setup;
      document.querySelector('.answer').textContent = joke.punchline;
    }
  }
}
