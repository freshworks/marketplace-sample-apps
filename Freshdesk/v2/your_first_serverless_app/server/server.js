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
    console.log(`
      Details from payload:
      ${payload['data']['requester']['name']}
      email: ${payload['data']['requester']['email']}
      mobile: ${payload['data']['requester']['mobile']}
    `);
  }

};
