"use strict";

/**
 * @description -
 * Every time a new ticket is created, this app prints a "Hello {requester name}"
 * message to the terminal window. (Where you run 'fdk run')
 * @info - https://developers.freshdesk.com/v2/docs/your-first-serverless-app/
 */
exports = {
  events: [
    {
      event: "onTicketCreate",
      callback: "onTicketCreateHandler"
    }
  ],

  /**
   * When ticket is created, some details from the payload sent is logged.
   * @param {string} - A JSON string
   */
  onTicketCreateHandler: function onTicketCreateHandler(payload) {
    var details = "".concat(payload["data"]["requester"]["name"]);
    var email = "".concat(payload["data"]["requester"]["email"]);
    var mobile = "".concat(payload["data"]["requester"]["mobile"]);
    console.log(
      JSON.stringify({
        Details: details,
        email: email,
        mobile: mobile
      })
    );
  }
};
