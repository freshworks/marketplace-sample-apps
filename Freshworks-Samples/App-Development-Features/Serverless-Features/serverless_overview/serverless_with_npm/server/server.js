var _ = require('lodash');

exports = {
  onTicketCreateHandler: function(args) {
    console.log(_.union([1,2], [3,4]));
  }
};
