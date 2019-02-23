/**
 * @description -
 * Every time a new ticket is created, this app prints a "Hello {requester name}"
 * message to the terminal window. (Where you run 'fdk run')
 * 
 */

exports = {

  events: [
    { event: 'onTicketCreate', callback: 'onTicketCreateHandler' }
  ],
  // args is a JSON block containing the payload information.
  // args['iparam'] will contain the installation parameter values.
  onTicketCreateHandler: (args) => {
    console.log('Hello ' + args['data']['requester']['name']);
  }
  
};