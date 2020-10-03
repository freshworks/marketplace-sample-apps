const BASE_URL = `<%= iparam.domain %>`;
const request_buttons = document.querySelectorAll(".request-btn");
var client = null;

function displayStatus(type, message) {
  client.interface.trigger("showNotify", {
    type: type,
    message: message,
  });
}

function sendRequest(method, url, options) {
  client.request[method](url, options).then(
    () =>
      displayStatus("success", `${method.toUpperCase()} request successful`),
    () => displayStatus("danger", `${method.toUpperCase()} request failed`)
  );
}

function init() {
  function onclickFire(clickEvent) {
    let method = clickEvent.target.getAttribute("method");
    const url = BASE_URL + method;
    const options = {};
    options["headers"] = { "Content-Type": "application/json" };
    sendRequest(method, url, options);
  }
  for (request_button of request_buttons) {
    request_button.addEventListener("click", (e) => onclickFire(e));
  }
}

function startApp() {
  app.initialized().then(function getClient(_client) {
    client = _client;
    client.events.on("app.activated", init());
  });
}

document.addEventListener("DOMContentLoaded", startApp());
