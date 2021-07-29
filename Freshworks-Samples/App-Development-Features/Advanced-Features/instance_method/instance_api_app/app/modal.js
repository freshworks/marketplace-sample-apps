/**
 * This script file acts for modal.html
 *
 * This demonstrates, Using instance API to retrieve the data received from
 * the parent location.
 */

document.addEventListener("DOMContentLoaded", function () {
  app.initialized().then(function (_client) {
    var client = _client;
    client.instance.context().then(function (context) {
      console.log("Modal instance API context", context);
      /* Output: Modal instance API context
       * { instanceId: "4",   location: "modal", parentId: "1",
       * modalData: {name: "James", email: "James@freshdesk.com"}
       * }"
       * */

      document.getElementById("name").value = context.data.name;
      document.getElementById("email").value = context.data.email;
    });
  });
});
