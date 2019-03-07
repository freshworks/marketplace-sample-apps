/**@desc - This app enables agents to schedule the creation of tickets.
 * 
 * @features -
 * 1. Scheduled Event - onScheduledEvent
 * 2. Using server method invocation(SMI) to schedule the creation of tickets
 * 3. Using a modal to display a ticket create form
 * 
 */
var request = require('request');
var base64 = require('base-64');

function createTicket(args) {
  console.log('Creating ticket');
  request({
    url: `https://${args.domain}/api/v2/tickets`,
    method: 'POST',
    headers: {
      Authorization: `Basic ${base64.encode(args.iparams.api_key + ':X')}`
    },
    json: {
      subject: args.data.subject,
      description: args.data.description,
      email: args.data.contact,
      priority: args.data.priority,
      status: args.data.status
    }
  }, function(err, res, body) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(body);
  });
}

function getListOfSchedules(userId, callback) {
  $db.get(`schedules_${userId}`).then(callback, function(err) {
    if (err.status == 404) {
      callback({list:{}});
    }
  });
}

function removeScheduleFromList(loggedInUserId, scheduleName, callback) {
  getListOfSchedules(loggedInUserId, function(data) {
    delete data.list[scheduleName];
    $db.set(`schedules_${loggedInUserId}`, data).then(function() {
      console.log('Successfully removed schedule from list');
      callback();
    }, function(err) {
      console.log(err);
      console.log('Unable to remove schedule from list');
    });
  });
}

exports = {

  events: [
    { event: 'onScheduledEvent', callback: 'onScheduledEventHandler' }
  ],

  createSchedule: function(args) {
    $schedule.create({
      name: args.scheduleName,
      data: args.scheduleData,
      schedule_at: args.scheduleData.scheduleAtUTC
    }).then(function(data) {
      renderData(null, data);
    }, function(err) {
      renderData(err);
    });
  },

  fetchSchedule: function(args) {
    $schedule.fetch({
      name: args.scheduleName
    }).then(function(data) {
      renderData(null, data);
    }, function(err) {
      renderData(err);
    });
  },

  updateSchedule: function(args) {
    $schedule.update({
      name: args.scheduleName,
      data: args.scheduleData,
      schedule_at: args.scheduleData.scheduleAtUTC
    }).then(function(data) {
      renderData(null, data);
    }, function(err) {
      renderData(err);
    });
  },

  deleteSchedule: function(args) {
    $schedule.delete({
      name: args.scheduleName
    }).then(function(data) {
      renderData(null, data);
    }, function(err) {
      renderData(err);
    });
  },

  onScheduledEventHandler: function(args) {
    removeScheduleFromList(args.data.loggedInUserId, args.data.scheduleName, function() {
      createTicket(args);
    });
  }

};