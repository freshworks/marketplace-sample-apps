let client = null;
let user_id = null;
let sessionState = false;
let t1 = null,
  t2 = null,
  t3 = null,
  t4 = null;
let endTime = null;
$(document).ready(function() {
  checkTimer();
  app.initialized().then(function(_client) {
    client = _client;
    client.events.on("app.activated", function() {
      /**
       * get the id of the user logged in using the data API
       */
      client.data.get("loggedInUser").then(
        function(data) {
          user_id = data.loggedInUser.user.id.toString();
        },
        function(err) {
          console.error("couldn't get loggedInUser, %o", err);
        }
      );
    });
  });
  /**
   * a click event handler to start and stop pomodoro sessions
   */
  $("#ip").click(function() {
    if (!sessionState) {
      makeSMICall("startPomodoro")
      .then(() => {session(); sessionState = true;}, (err) => {console.error("%o", err);notifyUser('error', "Couldn't start session");})
    } else {
      stopPomodoro(0);
      sessionState = false;
    }
  });

  /** a click event handler to get user's past sessions data, process it and pass it to a modal to show output in chart form
   * refer mod.js for flow continuation
   */
  $("#sa").click(function() {
    let hs = [];
    let td = null;
    client.db.get(user_id).then(
      function(data) {
        td = data.totalDays;
        data.history.forEach((element, index) => {
          hs.push([index + 1, element.noOfSessions, element.noOfInterruptions]);
        });
        client.interface.trigger("showModal", {
          title: "sample modal",
          template: "./modal/mod.html",
          data: { totalDays: td, history: hs }
        });
      },
      function(err) {
        console.error("couldn't get data for showActivity, %o", err);
      }
    );
  });

  /** a click event handler to clear all of the user's activity and schedules using clearActivity server.js method */
  $("#ca").click(function() {
    makeSMICall("clearActivity")
    .then(() => notifyUser("success", "cleared all activity!"), () => notifyUser("error", "couldn't clear activity"));
    
  });

  /** a click event handler to populate user data randomly using generateTestData server.js method */
  $("#td").click(function() {
    makeSMICall("generateTestData")
    .then(() => notifyUser("success", "Test data populated successfully!"), () => notifyUser("error", "couldn't populate test data"));
  });
  /** registering an event to save timer if the pages was unloaded during session */
  $(window).on("beforeunload", saveTimer);
});

/**
 * a helper function to triggers notifications
 * @param {string} notificationType - type of notification to be triggered
 * @param {string} notificationMessage - notification message to be displayed
 */
function notifyUser(notificationType, notificationMessage) {
  client.interface.trigger("showNotify", {
    type: notificationType,
    message: notificationMessage
  });
}

function startText() {
  $("#apptext").text("Click me to start focus mode!!!");
  $("#ip").html("start");
}

function stopText() {
  $("#apptext").text("Click me to stop focus mode!!!");
  $("#ip").html("stop");
}

/**
 * Function to show user that his session has started using a helper function
 */
function session() {
  notifyUser("warning", "your 25 mins streak starts!");
  t2 = setTimeout(takeBreak, 1500000);
  startTimer();
  countdown();
  stopText();
}

/**
 * a function to tell users that they should take thier 5 mins break using a helper function
 * It also triggers nextSessionCheck and session functions to notfy about thier progress using js setTimeout
 */
function takeBreak() {
  notifyUser("success", "take a 5 mins break!");
  t3 = setTimeout(nextSessionCheck, 290000);
}

/**
 * This function is executed before the break period's end time to ask if the user
 * wants to continue having pomodoro sessions or not
 * They can give thier response using the showConfirm interface triggered by this method
 */
function nextSessionCheck() {
  client.interface
    .trigger("showConfirm", {
      title: "Do you want to continue ?",
      message:
        "your break's about to be over, do you want to start a new pomodoro session ? "
    })
    .then(function(result) {
      if (result.message === "OK") {
        t1 = setTimeout(session, 10000);
      } else {
        stopPomodoro(1);
      }
    })
    .catch(function(err) {
      console.error("Error with showConfirm: %o", err);
    });
}

/**
 * This function invokes interruptSchedule server.js methods via a helper function
 * It also clears the setTimeout and setInterval events put forth by takeBreak and takebreak itself
 */
function stopPomodoro(flag) {
  flag === 1 ? makeSMICall("stopSchedule") : makeSMICall("interruptSchedule")
  .then(() => {
    stopTimer();
    clearTimeout(t1);
    clearTimeout(t3);
    clearTimeout(t2);
    startText();
  }, () => notifyUser("error", "couldn't stop session!"));
}

/**
 * This is a helper function which calls server.js methods using client.request.invoke API (SMI)
 * Data for a particular user has been atached to his ID in the database, hence the need for pasing user_id via SMI
 * @param {string} - methodName name of the server.js method you wish to call
 */
function makeSMICall(methodName) {
  return client.request.invoke(methodName, { id: user_id })
}

/** a function to save data of running counter using localstorage */
function saveTimer() {
  if (sessionState) {
    localStorage.setItem("timerStorage",JSON.stringify({ state: sessionState, end: endTime }));
  }
}

/** a function to set the session's end time and start countdown */
function startTimer() {
  endTime = new Date();
  endTime.setMinutes(endTime.getMinutes() + 25);
  t4 = setInterval(countdown, 1000);
}

/** function to update the counter */
function countdown() {
  let current = endTime - new Date();
  let minutes = Math.floor((current % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((current % (1000 * 60)) / 1000);
  $("#timer").text(`${minutes} min  :  ${seconds} sec`);
}

/** function to check if there is a running session, if so change the global variables which affetcs the UI and resumes the timer */
function checkTimer() {
  if (localStorage.getItem("timerStorage") !== null) {
    let temp = localStorage.getItem("timerStorage");
    temp = JSON.parse(temp);
    endTime = new Date(temp.end);
    sessionState = temp.state;
    stopText();
    countdown();
    t4 = setInterval(countdown, 1000);
    let difference = endTime.getTime() - new Date().getTime();
    if (difference > 300000) {
      t2 = setTimeout(takeBreak, (difference - 300000));
    }
    else {
      t3 = setTimeout(nextSessionCheck, (difference - 10000));
    }
  }
}

/** function to remove countdown and endTime */
function stopTimer() {
  endTime = null;
  $("#timer").empty();
  clearInterval(t4);
  localStorage.removeItem("timerStorage");
}
