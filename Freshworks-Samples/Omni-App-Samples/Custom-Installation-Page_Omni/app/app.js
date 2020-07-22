let client;

function init() {
  app.initialized().then(
    function (_client) {
      client = _client;
      debugger;
      client.events.on("app.activated", () => {
        console.info("App is Activated");
      });
    },
    (e) => errorLogger(e)
  );
}

function logInstallationParameters() {
  client.iparams.get().then(
    (iparamsInfo) => {
      console.info(iparamsInfo);
    },
    (e) => errorLogger(e)
  );
}

function errorLogger(e) {
  console.error("The follwoing Error occured -", error);
}

$(document).ready(init());
