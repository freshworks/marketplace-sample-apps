document.onreadystatechange = whenInteractive;

function whenInteractive() {
  if (document.readyState === 'interactive') {
    return app.initialized().then(getClientAPI).catch(console.error);
  }
}

function getClientAPI(_client) {
  let client = _client;
  // For apps those run in background,the callback is invoked everytime page is opened by the Freshdesk Agent.
  client.events.on('app.activated', function log() {
    return console.log(`app is activated 🥁`);
  });
}
