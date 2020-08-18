'use strict';

const helper = require('./lib/helper');

exports = {

  events: [
    { event: 'onAppInstall', callback: 'onAppInstallHandler' },
    { event: 'onTicketCreate', callback: 'onTicketCreateHandler' }
  ],

  /**
   * Runs as part of app install to setup pre-requisite
   */
  onAppInstallHandler: function() {
    // Add your code here
  },

  /**
   * Makes a request to httpbin with ticket id, subject and sets the status
   * of the request in DB
   * @param  {object} args - onTicketCreate Payload
   */
  onTicketCreateHandler: function(args) {
    const ticketId = args.data.ticket.id;
    const subject = args.data.ticket.subject;

    return $request.post({
      url: 'https://httpbin.org/post',
      json: {
        ticketId,
        subject
      }
    }).then(function() {
      console.info('Request successful');
      helper.setStatus(ticketId, true);
    }, function() {
      console.error('Request failed');
      helper.setStatus(ticketId, false);
    });
  },

  /**
   * Returns a mock success / failure response based on the presence of name
   * property in the payload
   * @param  {object} args - SMI Payload
   */
  createUser: function(args) {
    if (!args.name) {
      return renderData({
        message: 'name is missing'
      });
    }
    return renderData(null, {
      id: 123
    });
  }
};
