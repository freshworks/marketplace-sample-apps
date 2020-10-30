const DANGER_NOTIFICATION = 'danger';
const SUCCESS_NOTIFICATION = 'success';
const FIELDS_TO_VALIDATE = ['subject', 'description', 'contact', 'scheduleAt'];

function getFieldValues() {
  return {
    subject: q('#ticket-subject').value,
    description: q('#ticket-description').value,
    contact: q('#ticket-contact').value,
    status: Number(q('#ticket-status').value),
    priority: Number(q('#ticket-priority').value),
    scheduleAt: q('#schedule-time').value
  };
}

function validateFields() {
  q('.validation-message').innerHTML = '';
  var scheduleData = getFieldValues();
  var isValid = true;

  for (var field of FIELDS_TO_VALIDATE) {
    if (!scheduleData[field]) {
      q(`#${field}-error`).innerHTML = 'Please fill this required field';
      isValid = false;
    }
  }

  if ((new Date(scheduleData.scheduleAt) - new Date(Date.now())) / 1000 / 60 < 10) {
    q('#scheduleAt-error').innerHTML = 'Schedule time must be at least 10 minutes in future';
    isValid = false;
  }

  if (scheduleData['contact'] && !validEmail(scheduleData['contact'])) {
    q('#contact-error').innerHTML = 'Please enter a valid email';
    isValid = false;
  }
  return isValid;
}

function getListOfSchedules(userId, callback) {
  client.db.get(`schedules_${userId}`)
  .then(function(data) {
    callback(data);
  }, function(err) {
    if (err.status == 404) {
      return callback({list:{}});
    }
    console.log(err);
    sendNotification(DANGER_NOTIFICATION, `Error fetching list of schedules`);
  });
}

function addScheduleToList(schedule, callback) {
  getListOfSchedules(loggedInUserId, function(data) {
    data.list[schedule.scheduleName] = schedule.subject;
    client.db.set(`schedules_${loggedInUserId}`, data).then(function() {
      callback();
    }, function(err) {
      console.log(err);
      sendNotification(DANGER_NOTIFICATION, `Error storing list of schedules`);
    });
  });
}

function addListeners() {
  q('#create-schedule').addEventListener('click', function() {

    // Validate the values provided in the schedule creation form
    if (validateFields()) {

      // Generate an unique ID for storing the schedule
      var scheduleName = generateUuid();

      var scheduleData = getFieldValues();

      Object.assign(scheduleData, {
        loggedInUserId: loggedInUserId,
        scheduleName: scheduleName,
        scheduleAtUTC: new Date(scheduleData.scheduleAt).toISOString()
      });

      client.request.invoke('createSchedule', {
        scheduleName: scheduleName,
        scheduleData: scheduleData
      }).then(function(data) {

        // Persist the schedule name to the list post creation of schedule
        addScheduleToList({
          scheduleName: scheduleName,
          subject: scheduleData.subject
        }, function(err) {
          sendNotification(SUCCESS_NOTIFICATION, 'Schedule created');
          client.instance.close();
        });

      }, function(err) {
        console.log(err);
        sendNotification(DANGER_NOTIFICATION, `Error while creating schedule`);
      });
    }
  });

  q('#update-schedule').addEventListener('click', function() {

    // Validate the values provided in the schedule creation form
    if (validateFields()) {

      var scheduleData = getFieldValues();

      Object.assign(scheduleData, {
        loggedInUserId: loggedInUserId,
        scheduleName: currentUuid,
        scheduleAtUTC: new Date(scheduleData.scheduleAt).toISOString()
      });

      client.request.invoke('updateSchedule', {
        scheduleName: currentUuid,
        scheduleData: scheduleData
      }).then(function(data) {

        // Update the subject to the uuid in datastore
        addScheduleToList({
          scheduleName: currentUuid,
          subject: scheduleData.subject
        }, function() {
          sendNotification(SUCCESS_NOTIFICATION, 'Schedule updated');
          client.instance.close();
        });
      }, function(err) {
        console.log(err);
        sendNotification(DANGER_NOTIFICATION, `Error while updating schedule`);
      });
    }
  });

}

function populateData(scheduleData) {
  q('#ticket-subject').value = scheduleData.data.subject;
  q('#ticket-description').value = scheduleData.data.description;
  q('#ticket-contact').value = scheduleData.data.contact;
  q('#ticket-status').value = scheduleData.data.status;
  q('#ticket-priority').value = scheduleData.data.priority;
  q('#schedule-time').value = scheduleData.data.scheduleAt;

  // Persist the uuid of populated schedule (to be used while updating)
  window.currentUuid = scheduleData.data.scheduleName;
}

document.addEventListener('DOMContentLoaded', function() {
  addListeners();
  app.initialized().then(function(_client) {
    window.client = _client;

    client.data.get('loggedInUser').then(function(user) {
      window.loggedInUserId = user.loggedInUser.id;
    });

    client.instance.context().then(function(context){
      if (context.data.newSchedule) {
        q("#create-schedule").classList.remove('hidden');
      }
      else {
        populateData(context.data.scheduleData);
        q("#update-schedule").classList.remove('hidden');
      }
    });
  });
});