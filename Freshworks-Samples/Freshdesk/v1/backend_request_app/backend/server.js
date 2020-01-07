// Make sure to install dependencies before local testing
// > frsh install
// > frsh run

/*
   - load the npm dependencies using loadDependency.
   - load the lib directory files using loadLib.
*/

var request = loadDependency('request');
var handler = loadLib('handle-response');

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
