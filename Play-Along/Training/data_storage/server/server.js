exports = {

  events: [
    { event: 'onTicketCreate', callback: 'onTicketCreateHandler' },
    { event: 'onTicketUpdate', callback: 'onTicketUpdateHandler' }
  ],

  onTicketCreateHandler: function(args) {
    $db.set('user_info', {
      name: 'Rachel',
      email: 'rachel@freshdesk.com'
    })
    .then(function(data) {
      console.log(data);
    }, function(err) {
      console.log(err);
    });
  },

  onTicketUpdateHandler: function(args) {
    $db.get('user_info')
    .then(function(data) {
      console.log(data);
    }, function(err) {
      console.log(err);
    });
  }

};
