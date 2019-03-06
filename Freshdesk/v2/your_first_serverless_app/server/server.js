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
  // args is a JSON block containing the payload information.
  // args['iparam'] will contain the installation parameter values.
  onTicketCreateHandler: function (args) {
    console.log('Hello ' + args['data']['requester']['name']);
  }
  
};