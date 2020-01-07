/**  
 * @description - Everytime a new ticket is created, this app makes an API 
 * request to httpbin.org and prints the response to the terminal window.
 */
var request = require('request');
var handler = require('./handle-response');

exports = {

  events: [
    { event: 'onTicketCreate', callback: 'onTicketCreateHandler' }
  ],

  onTicketCreateHandler: function(args) {
    console.log('Making a GET request to httpbin.org');
    var url = "https://httpbin.org/get?q=" + args['data']['requester']['name'];
    
    request(url,(error, response) => {
      handler.handleResponse(error, response);
    });
  }

};