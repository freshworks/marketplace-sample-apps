"use strict";

/**
 * @description - This app makes REST API calls to httpbin.org.
 *
 * 1. Request API - GET, POST, PUT & DELETE
 */
var BASE_URL = "https://httpbin.org/";
$(document).ready(function () {
  (function () {
    app.initialized().then(function (_client) {
      window.client = _client;
      client.events.on("app.activated", init);
    });

    function init() {
      $(".request-btn").click(function (e) {
        var method = e.target.getAttribute("method");
        var url = BASE_URL + method;
        var options = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        req(method, url, options);
      });
    }
    /**
     * The method will make a request to httpbin.org. There parameters define the kind of request.
     *
     * @method {String} - GET/POST request
     * @url {String} - The URL of the endpoint
     *
     */

    function req(method, url, options) {
      client.request[method](url, options).then(
        function () {
          displayStatus(
            "success",
            "".concat(method.toUpperCase(), " request successful")
          );
        },
        function () {
          displayStatus(
            "danger",
            "".concat(method.toUpperCase(), " request failed")
          );
        }
      );
    }

    function displayStatus(type, message) {
      client.interface.trigger("showNotify", {
        type: type,
        message: message,
      });
    }
  })();
});
