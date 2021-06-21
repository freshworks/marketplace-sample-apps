document.onreadystatechange = whenInteractive;

function whenInteractive() {
  if (document.readyState === "interactive") {
    return app.initialized().then(getClientAPI).catch(console.error);
  }
}

function getClientAPI(_client) {
  window.client = _client;
  // For apps those run in background,the callback is invoked everytime page is opened by the Freshdesk Agent.
  client.events.on("app.activated", makeAPIcall);
}

function makeAPIcall() {
  client.iparams
    .get("creatorDomain")
    .then(function (data) {
      const URL =
        `https://${data.creatorDomain}.freshdesk.com/api/v2/contacts`;
      var options = {
        headers: {
          Authorization: `Basic <%= encode(iparam.api_key) %>`, // substitution happens by platform
          "Content-Type": "application/json",
        },
      };

      client.request
        .get(URL, options)
        .then(function ({ response }) {
          let contacts = JSON.parse(response);
          document.body.insertAdjacentHTML(
            "beforebegin",
            "<h2>Listing contacts</h2>"
          );
          contacts.forEach(function renderContact({ name }) {
            return document.body.insertAdjacentHTML(
              "afterbegin",
              `${name}<br>`
            );
          });
        })
        .catch(console.error);
    })
    .catch(console.error);
}
