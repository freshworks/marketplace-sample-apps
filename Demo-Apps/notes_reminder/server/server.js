function queueMessage(userId, notes) {
  $db
    .set(`${userId}_notifications`, {
      notes: notes,
    })
    .then(
      function () {
        console.log('Queued note to notify');
      },
      function (err) {
        console.log('Error while pushing note to notify');
      },
    );
}

exports = {
  events: [{event: 'onScheduledEvent', callback: 'onScheduledEventHandler'}],

  onScheduledEventHandler: function (args) {
    var userId = args.data.userId;
    var note = args.data.note;
    /**
      Push the note to the list of existing notes
    */
    $db.get(`${userId}_notifications`).then(
      function (data) {
        data.notes.push(note);
        queueMessage(userId, data.notes);
      },
      function (err) {
        if (err.status === 404) {
          queueMessage(userId, [args.data.note]);
        }
      },
    );
  },

  createSchedule: function (scheduleObject) {
    $schedule.create(scheduleObject).then(
      function operationPerformed(data) {
        console.error(data);
        renderData(null);
      },
      function operationErr(err) {
        renderData({
          message: 'Schedule creation failed',
        });
      },
    );
  },
};
