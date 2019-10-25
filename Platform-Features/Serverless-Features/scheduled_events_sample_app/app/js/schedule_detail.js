const DANGER_NOTIFICATION = 'danger';
const SUCCESS_NOTIFICATION = 'success';
const FIELDS_TO_VALIDATE = ['subject', 'description', 'contact', 'scheduleAt'];

function getFieldValues() {
  return {
    subject: jQuery('#ticket-subject').val(),
    description: jQuery('#ticket-description').val(),
    contact: jQuery('#ticket-contact').val(),
    status: Number(jQuery('#ticket-status').val()),
    priority: Number(jQuery('#ticket-priority').val()),
    scheduleAt: jQuery('#schedule-time').val()
  };
}

function validateFields() {
  jQuery('.validation-message').html('');
  var scheduleData = getFieldValues();
  var isValid = true;

  for (var field of FIELDS_TO_VALIDATE) {
    if (!scheduleData[field]) {
      jQuery(`#${field}-error`).html('Please fill this required field');
      isValid = false;
    }
  }

  if ((new Date(scheduleData.scheduleAt) - new Date(Date.now())) / 1000 / 60 < 10) {
    jQuery('#scheduleAt-error').html('Schedule time must be at least 10 minutes in future');
    isValid = false;
  }

  if (scheduleData['contact'] && !validEmail(scheduleData['contact'])) {
    jQuery('#contact-error').html('Please enter a valid email');
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
  jQuery('#create-schedule').click(function() {

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

  jQuery('#update-schedule').click(function() {

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
  jQuery('#ticket-subject').val(scheduleData.data.subject);
  jQuery('#ticket-description').val(scheduleData.data.description);
  jQuery('#ticket-contact').val(scheduleData.data.contact);
  jQuery('#ticket-status').val(scheduleData.data.status);
  jQuery('#ticket-priority').val(scheduleData.data.priority);
  jQuery('#schedule-time').val(scheduleData.data.scheduleAt);

  // Persist the uuid of populated schedule (to be used while updating)
  window.currentUuid = scheduleData.data.scheduleName;
}

$(document).ready( function() {
  addListeners();
  app.initialized().then(function(_client) {
    window.client = _client;

    client.data.get('loggedInUser').then(function(user) {
      window.loggedInUserId = user.loggedInUser.id;
    });

    client.instance.context().then(function(context){
      if (context.data.newSchedule) {
        jQuery("#create-schedule").removeClass('hidden');
      }
      else {
        populateData(context.data.scheduleData);
        jQuery("#update-schedule").removeClass('hidden');
      }
    });
  });
});