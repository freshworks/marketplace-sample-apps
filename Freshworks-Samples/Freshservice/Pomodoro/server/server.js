
exports = {

  /** registering the event along with its callback function */
  events: [{ event: "onScheduledEvent", callback: "scheduledEventHandler" }],


  /**
   * This is the initial method called by the pomodoro app
   * This method is responsible for setting up data skeleton and schedules
   * This is invoked using the SMI
   * @param {string} args - id of the user passed by the front-end using SMI call
   */
  serverMethod: function(args) {
    console.log("creating scheduled event, %o", args);
    let uid = args.id;

    $schedule
      .fetch({
        name: "Increment_Day"
      })
      .then(
        function(data) {
          console.log("schedule already defined for the day, %o", data);
        },
        function(err) {
          console.log("initializing for the day!");
          console.log(JSON.stringify(err));
          let x = new Date();
          x.setHours(0, 0, 0, 0);
          x.setDate(x.getDate() + 1);
          x = x.toISOString();
          $schedule.create({
            name: "Increment_Day",
            data: {type: "incrementDay", id: uid},
            schedule_at: x
          })
            .then(
              function(data) {
                console.log("incrementDay successfully created, %o", data);
              },
              function(err) {
                console.error("Couldn't create incrementDay, %o", err);
              }
            );
        }
      );

    $schedule
      .create({
        name: "regular_schedule",
        data: { type: "regular", id: uid },
        schedule_at: new Date().toISOString(),
        repeat: {
          time_unit: "minutes",
          frequency: 25
        }
      })
      .then(
        function(data) {
          console.log("regular_schedule created sucessfully, %o", data);
        },

        function(err) {
          console.error("regular_schedule couldn't be created, %o", err);
        }
      );
      let td = 0;
      let hs = [ {noOfSessions: 0, noOfInterruptions: 0} ]
      this.createDataSkeleton(uid, {totalDays: td, history: hs}, "Initial");
    renderData(null, { reply: "created events sucessfully" });
  },

  /**
   * Handler funtion for both the scheduled events
   * @param {JSON} args - data passed by scheduled events which inclues ID of the user and the type of schedule calling the handler
   */
  scheduledEventHandler: function(args) {
    obj = this;
    if (args.data.type == "regular") {
      $db.get(args.data.id).then(
        function(data) {
          let td = data.totalDays;
          let hs = data.history;
          hs[td].noOfSessions += 1;
          obj.updateDataSkeleton(args.data.id, {history: hs}, "regular");
        },
        function(err) {
          console.error("Couldn't access data from scheduldEventHandler, %o", err);
        }
      );
    } else {
      $db.get(args.data.id).then(function(data) {
        td = data.totalDays;
        hs = data.history;
        if (data.totalDays < 29) {
          td += 1;
          hs.push({ noOfSessions: 0, noOfInterruptions: 0 });
        } else {
          hs.shift();
          hs.push({ noOfSessions: 0, noOfInterruptions: 0 });
        }
        obj.updateDataSkeleton(args.data.id, {history: hs}, "end Day");
      });
    }
  },

  /**
   * This function deletes the schedule and records the event as an interruption as this will be fired only when the session is interrupted
   * @param {JSON} args - conatins the user id passed by the front - end
   */
  interruptSchedule: function(args) {
    let uid = args.id;
    let td = null, hs = null;
    let obj = this;
      this.removeSchedule("regular_schedule");
      $db.get(uid).then(
        function(data) {
          td = data.totalDays;
          hs = data.history;
          hs[td].noOfInterruptions += 1;
          console.log(hs);
          obj.updateDataSkeleton(uid, {history: hs}, "recorded interruption");
        },
        function(err) {
          console.error("Couldn't fetch data from interruptSchedule method, %o", err);
        }
      );
    renderData(null, { reply: "deleted events sucessfully" });
  },

  /**
   * only deletes schedule without recording interruption
   * @param {JSON} args - contains the user id passed by the front - end
   */
  deleteSchedule: function(args) {
    console.log("delete schedule invoked!, %o" + args);
    this.removeSchedule("regular_schedule");
  },

  /**
   * This function deletes all schedules and data, essensitally making it a blank slate
   * @param {JSON} args - conatins the user id passed by the front - end
   */
  clearActivity: function(args) {
    let uid = args.id;
    this.removeSchedule("Increment_Day");
    this.removeSchedule("regular_schedule");

    $db.delete(uid).then(
      function(data) {
        console.log("Data cleaning succeeded, %o", data);
      },
      function(err) {
        console.error("Data cleaingfailed, %o", err);
      }
    );
    renderData(null, { reply: "deleted events sucessfully" });
  },

  /**
   * This functions creates a new data skeleton populated with random data for 30 days
   * @param {JSON} args - contains the user id passed by the front - end 
   */
  testData: function(args) {
    let uid = args.id;
    let td = 29;
    let hs = [];
    for (let i = 0; i < 29; i++) {
      hs.push({
        noOfSessions: Math.ceil(Math.random() * 10),
        noOfInterruptions: Math.ceil(Math.random() * 10)
      });
    }
    this.createDataSkeleton(uid, { totalDays: td, history: hs }, "Test Data");
    renderData(null, { reply: "Test data updated sucessfully" });
  },

  /**
   * This function deletes the schedule passed to it
   * @param {string} scheduleName - name of the schedule to be deleted
   */
  removeSchedule: function(scheduleName) {
    $schedule.delete({
      name: scheduleName
    })
    .then(function(data) {
      console.log("%s deleted successfully!, %o", scheduleName, data);
    },
    function(err) {
      console.error("%s couldn't be deleted successfully!, %o", scheduleName, err);
    });
  },

  /**
   * This function updates the data skeleton with the new values using data storage API
   * @param {string} uid - ID of the user logged in
   * @param {string} updateObject - js object containing the data to be updated in the data skelton
   * @param {string} message  - passed by the calling function to identify themselves in the logs
   */
  updateDataSkeleton: function(uid, updateObject, message) {
    $db.update(uid, "set", updateObject).then(
      function(data) {
        console.log("Success %s : %o", message, data);
      },
      function(err) {
        console.error("Failure %s err: %o", message, err);
      }
    );
  },

  /**
   * This function updates the data skeleton with the new values using data storage API
   * @param {string} uid - ID of the user logged in
   * @param {string} dataObject - js object containing the data to create the skeleton with
   * @param {string} message  - passed by the calling function to identify themselves in the logs
   */
  createDataSkeleton: function(uid, dataObject, message) {
    $db
      .set(uid, dataObject, {setIf: "not_exist"})
      .done(function(data) {
        console.log("Success %s : %o", message, data);
      })
      .fail(function(err) {
        console.error("Failure %s err: %o", message, err);
      });
  }
};
