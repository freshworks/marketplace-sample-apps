var request = require('request');
var handler = require('./handle-response');

exports = {

  events: [
    { event: 'onTicketCreate', callback: 'onTicketCreateHandler' }
  ],

  onTicketCreateHandler: function(args) {
    console.log('Making a GET request to httpbin.org');
    var url = "https://httpbin.org/get?q=" + args['data']['requester']['name'];
    
    request(url, function (error, response) {
      handler.handleResponse(error, response);
    });
  }

};
