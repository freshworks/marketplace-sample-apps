var [client, noteElement, scheduleObject, REMINDER_INTERVAL] = [
  null,
  null,
  null,
  6
];
var appObject = {};

ready(start);

function start() {
  const notifyElement = document.getElementById('notify');
  noteElement = document.getElementById('note');
  app.initialized().then(function getClientObj(_client) {
    client = _client;
    client.data.get('loggedInUser').then(function getData(user) {
      appObject.userId = user.loggedInUser.id;
    }, logError);
    client.events.on('app.activated', function waitForClick() {
      notifyElement.addEventListener('click', createSchedule);
    });
  });
}

function ready(start) {
  if (document.readyState != 'loading') start();
  else document.addEventListener('DOMContentLoaded', start);
}

function generateUniqueId() {
  return Math.random().toString(36).substring(2);
}

function fwNotify(notificationType, messageContent) {
  client.interface
    .trigger('showNotify', {
      type: notificationType,
      message: messageContent
    })
    .then(interfaceData => {
      console.info(`💁‍♂️ Notification created`);
    })
    .catch(error => {
      console.error(`error 💣`);
    });
  return;
}
function createSchedule() {
  console.log('clickedd');
  let currentTime = new Date();
  currentTime.setMinutes(currentTime.getMinutes() + REMINDER_INTERVAL);
  note = noteElement.value;
  scheduleObject = {
    scheduleName: generateUniqueId(),
    userId: appObject.userId,
    note: note,
    scheduleAt: currentTime.toISOString()
  };
  client.request
    .invoke('createSchedule', scheduleObject)
    .then(function onSuccessSMI(data) {
      console.info(`server method invoked ${data}`);
    }, logError);
}
function checkForNotifications() {
  client.db.get(`${scheduleObject.userId}_notifications`).then(
    function fetchFromeDB(data) {
      data.notes.forEach(function getNote(note) {
        client.interface.trigger('showNotify', {
          type: 'success',
          title: 'Reminder',
          message: note
        });
      });
      client.db.delete(`${userId}_notifications`);
    },
    function (err) {
      console.error(`some error occurred: ${err}`);
    }
  );
}
function logError(err) {
  console.error(`Train took the wrong route 🚂:`);
  console.error;
}
