"use strict";

/**
 * Show modal to find link from the alias
 */
function openFindAliasModal() {
  client.interface
    .trigger("showModal", {
      title: "Find Alias",
      template: "./templates/find_alias.html",
    })
    .catch(function (error) {
      console.error("unable to open find alias modal");
      console.error(error);
    });
}

/**
 * Show modal to create new alias
 */
function openCreateAliasModal() {
  client.interface
    .trigger("showModal", {
      title: "Add new Alias",
      template: "./templates/create_alias.html",
      data: {},
    })
    .catch(function (error) {
      console.error("unable to open create alias modal");
      console.error(error);
    });
}

/**
 * Show a notification toast with the given title and message
 *
 * @param {String} type - type of the notification
 * @param {String} title - title of the notification
 * @param {String} message - content to be shown in the notification
 **/
function showNotify(type, message) {
  client.interface
    .trigger("showNotify", {
      type: type,
      message: message,
    })
    .catch(function (error) {
      console.error("unable to show notifications with parameters");
      console.error(type, message);
      console.error(error);
    });
}

/**
 *  Updates the alias value in the data storage
 *
 * @param {String} key - alias
 * @param {String} value - link to be saves as the value of the alias
 */
function updateAliasValue(key, value) {
  client.db.update(key, "set", { url: value }).then(
    function (data) {
      client.db.update(key, "increment", { updates: 1 }).then(
        function (data) {
          showNotify("success", "Successfully updated the alias link");
        },
        function (error) {
          console.error("failed to increment");
          console.error(error);
          showNotify("danger", "Failed to update the updates counter of alias");
        }
      );
    },
    function (error) {
      console.error("failed to update");
      console.error(error);
      showNotify("danger", "Failed to update the alias link");
    }
  );
}

function makeInterfaceAPI(data) {
  client[data.api][data.action](data.method, data.payload).then(
    function (result) {
      if (data.payload.title === "Confirmation") {
        if (result.message === "Override") {
          updateAliasValue(data.args.key, data.args.value);
        } else {
          console.error("Chose no to override");
          showNotify("success", "Skipped to update the alias link");
        }
      }
    },
    function (error) {
      console.error("Error: unable to perform interface API");
      console.error(error);
    }
  );
}

function addEventListeners() {
  document.getElementById("btnFindAlias").onclick = openFindAliasModal;
  document.getElementById("btnAddNewAlias").onclick = openCreateAliasModal;

  /**
   * Receives the event from the instance API
   *
   * @param {Event} event - The event from the instance API
   */
  client.instance.receive(function (event) {
    makeInterfaceAPI(event.helper.getData().message);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  app
    .initialized()
    .then(function (_client) {
      window.client = _client;
      client.events.on("app.activated", function () {
        addEventListeners();
      });
    })
    .catch(function (error) {
      console.error("Failed to initialize the app with error");
      console.error(error);
    });
});
