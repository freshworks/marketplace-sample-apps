var client;
// All Free - https://api.publicapis.org/entries
// Free API - https://official-joke-api.appspot.com/random_joke
document.onreadystatechange = function () {
  if (document.readyState === 'interactive') renderApp();

  function renderApp() {
    var onInit = app.initialized();

    onInit.then(getClient).catch(handleErr);

    function getClient(_client) {
      client = _client;
      client.events.on('app.activated', onAppActivate);
    }
  }
};

function onAppActivate() {}

function handleErr(err) {
  console.error(`Error occured. Details:`, err);
}
