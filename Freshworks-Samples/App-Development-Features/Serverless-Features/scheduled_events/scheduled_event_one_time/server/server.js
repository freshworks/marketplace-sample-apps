/**
 * Add a note to a freshdesk ticket.
 *
 * @param {string} domain - Freshdesk domain
 * @param {number} ticketId - Ticket Id to which note has to be added
 * @param {string} note - Note to be added
 */
function addNote(domain, ticketId, note) {
  console.log(`Adding note to the ticket - ${ticketId}`);
  const requestUrl = `https://${domain}/api/v2/tickets/${ticketId}/notes`;
  const requestOptions = {
    headers: {
      Authorization: `Basic <%= encode(iparam.api_key + ':X') %>}`
    },
    json: {
      body: note
    }
  };

  $request.post(requestUrl, requestOptions).then(function(data) {
    if (data.status === 201) {
      console.log('Note has been added - ', JSON.stringify(data.response));
    }
  }, function(err) {
    console.log('Failed to add note - ', JSON.stringify(err));
  });
}

exports = {
  /**
   * Create a schedule (through SMI)
   *
   * @param {object} args - SMI args
   */
  createSchedule: function(args) {
    console.log(`Scheduling an event to run at - ${args.schedule_at}`);
    $schedule.create({
      name: `ticket_${args.ticket_id}`,
      data: {
        ticket_id: args.ticket_id,
        note: args.note
      },
      schedule_at: args.schedule_at
    }).then(function(data) {
      renderData(null, data);
    }, function(err) {
      renderData(err);
    });
  },

  /**
   * Handle scheduled event.
   *
   * Add a note to the freshdesk ticket based on the data stored as part of
   * the event.
   *
   * @param {object} args - Scheduled event args
   */
  onScheduledEventHandler: function(args) {
    addNote(args.domain, args.data.ticket_id, args.data.note);
  }
};
