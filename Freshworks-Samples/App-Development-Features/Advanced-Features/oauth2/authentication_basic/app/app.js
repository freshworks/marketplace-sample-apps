document.addEventListener("DOMContentLoaded", function () {
  app.initialized().then(function (client) {
    window.client = client;
    client.events.on("app.activated", function () {
      client.iparams.get("subdomain").then(function (iparam) {
        client.request
          .get(
            `https://${iparam.subdomain}.freshdesk.com/api/v2/search/tickets?query="tag:%27sample%27"`,
            {
              headers: {
                Authorization: "Basic <%= encode(iparam.apikey) %>",
              },
            }
          )
          .then(function (data) {
            let html = "";
            JSON.parse(data.response).results.forEach(function (result) {
              console.log(result);
              html += `<li>${result.subject}</li>`;
            });
            document.getElementById("content").innerHTML = `<ul>${html}</ul>`;
          });
      });
    });
  });
});
