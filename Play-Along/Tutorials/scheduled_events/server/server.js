function queueMessage(userId, notes) {
  $db.set(`${userId}_notifications`, {
    notes: notes
  }).then(function() {
    console.log('Queued note to notify');
  }, function(err) {
    console.log('Error while pushing note to notify');
  });
}

exports = {

  events: [
    { event: 'onScheduledEvent', callback: 'onScheduledEventHandler' }
  ],

  onScheduledEventHandler: function(args) {
    const userId = args.data.userId;
    const note = args.data.note;
    /**
      Push the note to the list of existing notes
    */
    $db.get(`${userId}_notifications`).then(function(data) {
      data.notes.push(note);
      queueMessage(userId, data.notes);
    }, function(err) {
      if (err.status === 404) {
        queueMessage(userId, [args.data.note]);
      }
    });
  },

  createSchedule: function(args) {
    $schedule.create({
      name: args.scheduleName,
      data: {
        userId: args.userId,
        note: args.note
      },
      schedule_at: args.scheduleAt
    }).then(function(data) {
      renderData(null);
    }, function(err) {
      renderData({
        message: 'Schedule creation failed'
      });
    });
  }

};