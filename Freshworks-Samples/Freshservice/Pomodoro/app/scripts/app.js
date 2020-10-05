let client = null;
let user_id = null;
let sessionState = false;
let t1 = null,
  t2 = null,
  t3 = null,
  t4 = null;
let endTime = null;

// Start the App initialization based on the document load status
isDocumentReady();

function startAppRender() {
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
          notifyUser("error", "couldn't get loggedInUser");
          console.error("couldn't get loggedInUser, %o", err);
        }
      );
    });
  });

  /**
   * a click event handler to start and stop pomodoro sessions
   */
  document.querySelector("#startStopButton").addEventListener("click", (event) => {
    if (!sessionState) {
      makeSMICall("startPomodoro").then(
        () => {
          startSession();
          sessionState = true;
        },

        err => {
          console.error("Couldn't start sessions\n%o", err);
          notifyUser("error", "Couldn't start session");
        }
      );
    } else {
      stopPomodoro(0);
      sessionState = false;
    }
  });

  /**
   * a click event handler to get user's past sessions data, process it and pass it to a modal to show output in chart form
   * refer mod.js for flow continuation
   */
  document.querySelector("#showActivity").addEventListener("click", () => {
    let hs = [];
    let td = null;
    client.db.get(user_id).then(
      function(data) {
        td = data.totalDays;
        data.history.forEach((element, index) => {
          hs.push([index + 1, element.noOfSessions, element.noOfInterruptions]);
        });

        client.interface.trigger("showModal", {
          title: "Pomodoro Activity",
          template: "./views/mod.html",
          data: { totalDays: td, history: hs }
        });
      },

      function(err) {
        console.error("couldn't get data for showActivity, %o", err);
      }
    );
  });

  /**
   * a click event handler to clear all of the user's activity and schedules using clearActivity server.js method
   */
  document.querySelector("#clearActivity").addEventListener("click", () => {
    makeSMICall("clearActivity").then(
      () => notifyUser("success", "cleared all activity!"),
      () => notifyUser("error", "couldn't clear activity")
    );
  });

  /**
   * a click event handler to populate user data randomly using generateTestData server.js method
   */
  document.querySelector("#testData").addEventListener("click", () => {
    makeSMICall("generateTestData").then(
      () => notifyUser("success", "Test data populated successfully!"),
      () => notifyUser("error", "couldn't populate test data")
    );
  });

  /**
   * registering an event to save timer if the pages was unloaded during session
   */
  window.addEventListener("beforeunload", saveTimer);
}

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
    document.getElementById("sessionText").innerText = "Click me to start focus mode!!!";
    document.getElementById("startStopButton").innerText = "Start";
}

function stopText() {
    document.getElementById("sessionText").innerText = "Click me to stop focus mode!!!";
    document.getElementById("startStopButton").innerText = "Stop";
}

/**
 * Function to show user that his session has started using a helper function
 */
function startSession() {
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
  flag === 1 ? makeSMICall("stopSchedule") : makeSMICall("interruptSchedule").then(() => {
          stopTimer();
          clearTimeout(t1);
          clearTimeout(t3);
          clearTimeout(t2);
          startText();
        },

        () => notifyUser("error", "couldn't stop session!")
      );
}

/**
 * SMI stands for Server Method Invocation
 * It is a mechanism through which frontend component of an app can invoke the serverless component of the app.
 * Here we call the method (paramter methodName) which is defined in the server.js and will be executed in the server.
 * We can also pass data to it in the form JSON. here we pass the ID of the user logged in.
 * @param {string} - methodName name of the server.js method you wish to call
 * @param {JSON} - ID of the username logged in
 */
function makeSMICall(methodName) {
  return client.request.invoke(methodName, { id: user_id });
}

/**
 * a function to save data of running counter using localstorage
 */
function saveTimer() {
  if (sessionState) {
    localStorage.setItem(
      "timerStorage",
      JSON.stringify({ state: sessionState, end: endTime })
    );
  }
}

/**
 * a function to set the session's end time and start countdown
 */
function startTimer() {
  endTime = new Date();
  endTime.setMinutes(endTime.getMinutes() + 25);
  t4 = setInterval(countdown, 1000);
}

/**
 * function to update the counter
 */
function countdown() {
  let current = endTime - new Date();
  let minutes = Math.floor((current % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((current % (1000 * 60)) / 1000);
  document.getElementById("timer").innerText = `${minutes} min  :  ${seconds} sec`;
}

/**
 * function to check if there is a running session,
 * if so change the global variables which affetcs the UI and resumes the timer
 */
function checkTimer() {
  if (localStorage.getItem("timerStorage") !== null) {
    let temp = localStorage.getItem("timerStorage");

    try {
      temp = JSON.parse(temp);
    } catch (error) {
      notifyUser("error", "couldn't parse the stored time");
      console.error(
        "couldn't parse the stored time",
        error.name,
        error.message
      );
    }

    endTime = new Date(temp.end);
    sessionState = temp.state;
    stopText();
    countdown();
    t4 = setInterval(countdown, 1000);
    let difference = endTime.getTime() - new Date().getTime();

    if (difference > 300000) {
      t2 = setTimeout(takeBreak, difference - 300000);
    } else {
      t3 = setTimeout(nextSessionCheck, difference - 10000);
    }
  }
}

/**
 * function to remove countdown and endTime
 */
function stopTimer() {
  endTime = null;
  document.getElementById("timer").innerHTML = "";
  clearInterval(t4);
  localStorage.removeItem("timerStorage");
}

/**
 * A function used to check if the document has been loaded
 */
function isDocumentReady() {
    if (document.readyState != 'loading') {
        console.info('Scripts are deferred or loading async');
        startAppRender();
    } else {
        document.addEventListener('DOMContentLoaded', startAppRender);
    }
}
