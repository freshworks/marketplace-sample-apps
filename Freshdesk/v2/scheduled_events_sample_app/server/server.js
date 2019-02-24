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
  }, (err, res, body) => {
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

  createSchedule: (args) => {
    $schedule.create({
      name: args.scheduleName,
      data: args.scheduleData,
      schedule_at: args.scheduleData.scheduleAtUTC
    }).then((data) => {
      renderData(null, data);
    }, (err) => {
      renderData(err);
    });
  },

  fetchSchedule: (args) => {
    $schedule.fetch({
      name: args.scheduleName
    }).then((data) => {
      renderData(null, data);
    }, (err) => {renderData(err);
    });
  },

  updateSchedule: (args) => {
    $schedule.update({
      name: args.scheduleName,
      data: args.scheduleData,
      schedule_at: args.scheduleData.scheduleAtUTC
    }).then((data)=> {renderData(null, data);
    }, (err) => {renderData(err);
    });
  },

  deleteSchedule: (args) => {
    $schedule.delete({
      name: args.scheduleName
    }).then((data) => {renderData(null, data);
    }, (err) => {renderData(err);
    });
  },

  onScheduledEventHandler: (args) => {
    removeScheduleFromList(args.data.loggedInUserId, args.data.scheduleName, () => {
      createTicket(args);
    });
  }

};