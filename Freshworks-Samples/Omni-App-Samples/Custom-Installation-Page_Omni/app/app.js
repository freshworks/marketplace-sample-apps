var client;

function errorLogger(error) {
  console.error("The following Error occured");
  console.error(error);
}

function init() {
  app.initialized().then(function getClient(_client) {
    client = _client;
    client.events.on("app.activated", function onActivate() {
      console.info("App is Activated");
    });
  }, errorLogger);
}

function logInstallationParameters() {
  init();
  client.iparams.get().then(function getiparams(info) {
    console.info(info);
  }, errorLogger);
}

document.addEventListener("DOMContentLoaded", init);
