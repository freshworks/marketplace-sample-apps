let client;

$(document).ready(function () {
  app
    .initialized()
    .then(function (_client) {
      window.client = _client;
      let name = client.context.productName;
      console.log(name);
    })
    .catch(function (err) {
      console.error("Exception -", err);
    });
});
