"use strict";

/**
 * @description -
 * Every time a new ticket is created, this app prints a "Hello {requester name}"
 * message to the terminal window. (Where you run 'fdk run')
 * @info - https://developers.freshdesk.com/v2/docs/your-first-serverless-app/
 */
exports = {
  /**
   * When ticket is created, some details from the payload sent is logged.
   * @param {string} - A JSON string
   */
  onTicketCreateHandler: function onTicketCreateHandler(payload) {
    var details = String(payload["data"]["requester"]["name"]);
    var email = String(payload["data"]["requester"]["email"]);
    var mobile = payload["data"]["requester"]["mobile"];
    console.info(
      JSON.stringify({
        Details: details,
        email: email,
        mobile: mobile
      })
    );
  }
};
