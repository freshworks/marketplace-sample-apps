/**
 * @description -
 * Every time a new ticket is created, this app prints a "Hello {requester name}"
 * message to the terminal window. (Where you run 'fdk run')
 * @info - https://developers.freshdesk.com/v2/docs/your-first-serverless-app/
 */

exports = {
  events: [
    { event: 'onTicketCreate', callback: 'onTicketCreateHandler' }
  ],
  /**
   * When ticket is created, some details from the payload sent is logged.
   * @param {string} - A JSON string
   */
  onTicketCreateHandler: function (payload) {
    const details = `${payload['data']['requester']['name']}`;
    const email = `${payload['data']['requester']['email']}`;
    const mobile = `${payload['data']['requester']['mobile']}`;
    console.log(JSON.stringify({
      Details: details,
      email: email,
      mobile: mobile
    }));
  }
};
