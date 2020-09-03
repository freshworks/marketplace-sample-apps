const REMINDER_INTERVAL = 6

function generateUniqueId() {
  return Math.random().toString(36).substring(2)
}

function checkForNotifications() {
  client.db.get(`${userId}_notifications`).then(
    function (data) {
      /**
      For every note, create a notification
    */
      data.notes.forEach(function (note) {
        client.interface.trigger('showNotify', {
          type: 'success',
          title: 'Reminder',
          message: note,
        })
      })

      /**
      Delete the key (cleanup)
    */
      client.db.delete(`${userId}_notifications`)
    },
    function (err) {
      console.error(err)
    },
  )
}

// function createSchedule() {
//   const note = jQuery('#note').val()
//   const dateNow = new Date()

//   dateNow.setMinutes(dateNow.getMinutes() + REMINDER_INTERVAL)

//   client.request
//     .invoke('createSchedule', {
//       scheduleName: generateUniqueId(),
//       scheduleAt: dateNow.toISOString(),
//       userId: userId,
//       note: note,
//     })
//     .then(
//       function (data) {
//         console.log(data)
//       },
//       function (err) {
//         console.error(err)
//       },
//     )
// }

// $(document).ready(function () {
//   app.initialized().then(function (_client) {
//     window.client = _client

//     client.data.get('loggedInUser').then(
//       function (user) {
//         /**
//         Store user Id in window object for futher use
//       */
//         window.userId = user.loggedInUser.id

//         /**
//         Check for notifications
//       */
//         checkForNotifications()
//       },
//       function (err) {
//         console.error(err)
//       },
//     )

//     client.events.on('app.activated', function () {
//       /**
//         Listen for 'Remind me' button
//       */
//       jQuery('#notify').click(createSchedule)
//     })
//   })
// })

var [client, noteElement, REMINDER_INTERVAL] = [null, null, 6]
var appObject = {}

ready(start)

function start() {
  const notifyElement = document.getElementById('notify')
  noteElement = document.getElementById('note')
  app.initialized().then(function getClientObj(_client) {
    client = _client
    client.data.get('loggedInUser').then(function getData(user) {
      appObject.userId = user.loggedInUser.id
    }, logError)
    client.events.on('app.activated', function waitForClick() {
      notifyElement.addEventListener('click', createSchedule)
    })
  })
}

function ready(start) {
  if (document.readyState != 'loading') start()
  else document.addEventListener('DOMContentLoaded', start)
}

function fwNotify(notificationType, messageContent){
  client.interface.trigger("showNotify",{
    type: notificationType,
    message: messageContent
  }).then((interfaceData)=>{console.info(`💁‍♂️ Notification created`)})
  .catch((error)=>{console.error(error 💣)})
  return;
}

function createSchedule () {
  let currentTime = new Date()
  currentTime.setMinutes(currentTime.getMinutes() + REMINDER_INTERVAL)
  note = noteElement.value
  let scheduleObject = {
    scheduleName: generateUniqueId(),
    scheduleAt: currentTime.toISOString(),
    userId: appObject.userId,
    note: note,
  }
  client.request
    .invoke('createSchedule', scheduleObject)
    .then(function (data) {
      console.info(`server method invoked ${data}`)
    }, logError)
}


function logError(err) {
  console.error(`Train took the wrong route 🚂: ${err}`)
}




