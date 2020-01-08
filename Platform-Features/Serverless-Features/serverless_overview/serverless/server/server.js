var utility = require('./lib/utility');

exports = {

  events: [
    { event: 'onTicketCreate', callback: 'onTicketCreateHandler' }
  ],

  onTicketCreateHandler: function(args) {
    utility.printRequesterName(args);
  }

};
