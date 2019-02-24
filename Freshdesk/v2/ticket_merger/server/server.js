/**
 * Merges Tickets created by the same requester within a configurable time
 * window. Also, adds useful notes on the tickets mentioning the ticket to from
 * which the merge was done. Requires the Freshdesk API key to make the necessary
 * API calls to add notes, close tickets etc.,
 */
'use strict';

var helpers = require('./helpers');

function mergeWithPrimary(args) {
  var requests;

  if (helpers.withInWindow(args.primaryTicket, args.secondaryTicket, args.windowDuration)) {
    requests = [{
      method: 'POST',
      url: `${args.domain}/api/v2/tickets/${args.primaryTicket.id}/notes`,
      apiKey: args.apiKey,
      body: {
        private: true,
        body: helpers.generatePrimaryNote(args.secondaryTicket)
      },
    }, {
      method: 'POST',
      url: `${args.domain}/api/v2/tickets/${args.secondaryTicket.id}/notes`,
      apiKey: args.apiKey,
      body: {
        private: true,
        body: helpers.generateSecondaryNote(args.primaryTicket),
      },
    }, {
      method: 'PUT',
      url: `${args.domain}/api/v2/tickets/${args.secondaryTicket.id}`,
      apiKey: args.apiKey,
      body: {
        status: 5,
        source: args.secondaryTicket.source
      }
    }];

    return helpers.async.forEachSeries(requests, helpers.callAPI, function(error) {
      if (error) {
        console.log(`Merge failed with error ${error}`);
        console.log(`Args: ${helpers.inspect(args)}`);
        console.log(`Requests: ${helpers.inspect(requests)}`);
      }
    });
  }

  return helpers.saveTicket(args.requester.id, args.secondaryTicket);
}

exports = {
  events: [
    {
      event: 'onTicketCreate',
      callback: 'onTicketCreateHandler'
    }
  ],

  onTicketCreateHandler: function(payload) {
    const data = payload.data,
          iparams = payload.iparams,
          requester = data.requester,
          secondaryTicket = data.ticket;

    if (requester.id) {
      $db.get(requester.id.toString())
        .done((primaryTicket) => {
          mergeWithPrimary({
            requester: requester,
            domain: payload.domain,
            apiKey: iparams.apiKey,
            primaryTicket: primaryTicket,
            windowDuration: iparams.window,
            secondaryTicket: secondaryTicket
          });
        })
        .fail((error) => {
          if (error.status === 404) {
            return helpers.saveTicket(requester.id, secondaryTicket);
          }
        });
    }
  }
};
