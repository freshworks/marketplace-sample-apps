document.addEventListener("DOMContentLoaded", function () {
  app.initialized().then(function (_client) {
    var client = _client;
    client.events.on("app.activated", function () {
      document
        .querySelector(".btn-smi")
        .removeEventListener("click", function () {});
      document.querySelector(".btn-smi").addEventListener("click", function () {
        client.request.invoke("sendInfoToMiddleware", { foo: "bar" }).then(
          function () {
            client.interface.trigger("showNotify", {
              type: "success",
              message: "SMI Request successful.",
            });
          },
          function (err) {
            client.interface.trigger("showNotify", {
              type: "danger",
              message: "SMI Request failed.",
            });
          }
        );
      });
    });
  });
});
