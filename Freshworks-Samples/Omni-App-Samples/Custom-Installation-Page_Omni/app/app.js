let client;

function init() {
  app.initialized().then(
    function (_client) {
      client = _client;
      client.events.on("app.activated", logInstallationParameters());
    },
    (e) => errorLogger(e)
  );
}

function errorLogger(e) {
  console.error("The follwoing Error occured -", error);
}

function logInstallationParameters() {
  client.iparams.get().then(
    (iparamsInfo) => {
      console.info(iparamsInfo);
    },
    (error) => errorLogger(error)
  );
}

$(document).ready(init());
