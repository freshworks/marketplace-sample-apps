var client;

function init() {
  app.initialized().then(function getClientObject(_client) {
    client = _client;
    client.events.on("app.activated", function onActivate() {
      console.info("App is Activated");
    });
  }, errorLogger(e));
}

function logInstallationParameters() {
  client.iparams.get().then(function getiparams(info) {
    console.info(info);
  }, errorLogger(e));
}

function errorLogger(error) {
  console.error("The following Error occured -", error);
}

$(document).ready(init());
