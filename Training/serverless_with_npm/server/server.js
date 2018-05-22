var _ = require('lodash');

exports = {

  events: [
    { event: 'onTicketCreate', callback: 'onTicketCreateHandler' }
  ],

  onTicketCreateHandler: function(args) {
    console.log(_.union([1,2], [3,4]));
  }

};
