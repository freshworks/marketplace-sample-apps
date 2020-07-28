var client;
var errorLogger = function (error) {
  console.error("The following Error occured -", error);
};

function init() {
  app.initialized().then(function getClient(_client) {
    client = _client;
    client.events.on("app.activated", function onActivate() {
      console.info("App is Activated");
    });
  }, errorLogger(e));
}

function logInstallationParameters() {
  init();
  client.iparams.get().then(function getiparams(info) {
    console.info(info);
  }, errorLogger(e));
}

$(document).ready(init());
