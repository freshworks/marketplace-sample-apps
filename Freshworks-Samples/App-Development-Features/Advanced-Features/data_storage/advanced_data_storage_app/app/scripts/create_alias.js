"use strict";

/**
 * Request parent instance to display a confirmation alert with the given payload
 *
 * @param {Object} payload - payload with the necessary data to show confirmation alert
 * @param {string} args - additional data to send to the parent
 */
function alertParent(payload, args) {
  client.instance.close();

  client.instance.send({
    message: {
      api: "interface",
      action: "trigger",
      method: "showConfirm",
      payload: payload,
      args: args,
    },
  });
}

/**
 * Closes the current modal and sends message to parent to show a notification toast with the given title and message
 *
 * @param {String} type - type of the notification
 * @param {String} title - title of the notification
 * @param {String} message - content to be shown in the notification
 **/
function showNotify(type, message) {
  client.instance.close();

  client.instance.send({
    message: {
      api: "interface",
      action: "trigger",
      method: "showNotify",
      payload: { type: type, message: message },
    },
  });
}

/**
 * Construct options for the data storage operations
 *
 * @param {Number} ttl - time to expiry for the key-value pair
 * @param {Boolean} override - boolean to decide where to check and alert based on the key's existence in the data storage
 */
function constructOptions(ttl, override) {
  /** The ttl is added as an attribute by default to the returning Object. The setIf attribute is added only if the override is true. */
  return Object.assign({ ttl: ttl }, override ? {} : { setIf: "not_exist" });
}

/**
 * creates an alias for the link in the value with the given key
 *
 * @param {String} key - alias
 * @param {String} value - link to be stored for the alias
 * @param {Number} ttl - time to expiry for the key-value pair
 */
function createAlias(key, value, ttl) {
  client.db
    .set(key, { url: value, updates: 0 }, constructOptions(ttl, false))
    .then(
      function () {
        showNotify("success", "Successfully created the alias");
      },
      function (error) {
        var httpStatusCodeForError = 400;

        if (
          error.status === httpStatusCodeForError &&
          error.message === "The setIf conditional request failed"
        ) {
          alertParent(
            {
              title: "Confirmation",
              message: "The key already exists. Do you want to override?",
              saveLabel: "Override",
              cancelLabel: "No",
            },
            {
              key: key,
              value: value,
            }
          );
        } else {
          console.error("Error: failed to create alias");
          console.error(error);
          showNotify("danger", "Failed to create the alias");
        }
      }
    );
}

/**
 * adds new alias based on the alias and link from the input fields
 */
function addNewAlias() {
  var key = document.getElementById("inputAlias").value;
  var value = document.getElementById("inputLink").value;
  var ttl = 86400;

  createAlias(key, value, ttl);
}

document.addEventListener("DOMContentLoaded", function () {
  app
    .initialized()
    .then(function (_client) {
      window.client = _client;
    })
    .catch(function (error) {
      console.error("Failed to initialize the create_alias modal with error");
      console.error(error);
    });
  document
    .getElementById("btnCreateAlias")
    .addEventListener("click", addNewAlias);
});
