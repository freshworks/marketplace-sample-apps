var utility = require('./lib/utility');

exports = {
  onTicketCreateHandler: function (args) {
    utility.printRequesterName(args);
  }
};
