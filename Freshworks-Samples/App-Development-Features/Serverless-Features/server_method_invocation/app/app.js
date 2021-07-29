document.addEventListener("DOMContentLoaded", function () {
  app.initialized().then(function (client) {
    window.client = client;
    client.events.on("app.activated", function () {
      document.getElementById("smi").addEventListener("click", function () {
        client.request.invoke("makeRequest", {}).then(
          function (data) {
            console.log("Invocation Success..!!");
            console.log(data);
          },
          function (err) {
            console.log("Invocation Failed..!!");
            console.log(err);
          }
        );
      });
    });
  });
});
