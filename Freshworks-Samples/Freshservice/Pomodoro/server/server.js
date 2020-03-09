
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
    console.log("creating scheduled event...");
    console.log("args are...\n" + JSON.stringify(args));
    let uid = args.id;

    $schedule
      .fetch({
        name: "Increment_Day"
      })
      .then(
        function(data) {
          console.log("schedule already defined for the day!");
          console.log(JSON.stringify(data));
        },
        function(err) {
          console.log("initializing for the day!");
          console.log(JSON.stringify(err));
          let x = new Date(args["date"]);
          x.setHours(0, 0, 0, 0);
          x.setDate(x.getDate() + 1);
          $schedule.create({
            name: "Increment_Day",
            data: {type: "incrementDay", id: uid},
            schedule_at: x.toISOString()
          })
            .then(
              function(data) {
                console.log("incrementDay successfully created!");
                console.log(JSON.stringify(data));
              },
              function(err) {
                console.log("Couldn't create incrementDay...");
                console.log(JSON.stringify(err));
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
          console.log("schedule created sucessfully");
          console.log("promise of server method:\n" + JSON.stringify(data));
        },

        function(err) {
          console.log("Couldn't create schedule sucessfully!\n");
          console.log(JSON.stringify(err));
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
    console.log("args are:\n" + JSON.stringify(args));
    obj = this;
    if (args.data.type == "regular") {
      $db.get(args.data.id).then(
        function(data) {
          console.log(
            "printing data from scheduledEventhandler...\ndata: " +
              JSON.stringify(data)
          );
          let td = data.totalDays;
          let hs = data.history;
          hs[td].noOfSessions += 1;
          
          obj.updateDataSkeleton(args.data.id, {history: hs}, "regular");
        },
        function(err) {
          console.log(
            "couldn't access data from scheduledEventHandler....\nargs: " +
              JSON.stringify(err)
          );
        }
      );
    } else {
      $db.get(args.data.id).then(function(data) {
        td = data.totalDays;
        hs = data.history;
        console.log("after day, hs: " + hs + " td: " + td);
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
    console.log("Deleteing schedule...\nargs: " + JSON.stringify(args));
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
          obj.updateDataSkeleton(uid, {history: hs}, "record interruption");
        },
        function(err) {
          console.log(
            "couldn't fetch data from deleteSchedule Method\nargs: " +
              JSON.stringify(err)
          );
        }
      );
    renderData(null, { reply: "deleted events sucessfully" });
  },

  /**
   * only deletes schedule without recording interruption
   * @param {JSON} args - contains the user id passed by the front - end
   */
  deleteSchedule: function(args) {
    console.log("delete schedule invoked!\nargs: " + JSON.stringify(args));
    let uid = args.id;
    this.removeSchedule("regular_schedule");
  },

  /**
   * This function deletes all schedules and data, essensitally making it a blank slate
   * @param {JSON} args - conatins the user id passed by the front - end
   */
  clearActivity: function(args) {
    console.log("clearActivity invoked!\nargs: " + JSON.stringify(args));
    let uid = args.id;
    this.removeSchedule("Increment_Day");
    this.removeSchedule("regular_schedule");

    $db.delete(uid).then(
      function(data) {
        console.log(
          "cleaned data successfully!\nargs: " + JSON.stringify(data)
        );
      },
      function(err) {
        console.log(
          "couldn't clean data successfully!\nargs: " + JSON.stringify(err)
        );
      }
    );
    renderData(null, { reply: "deleted events sucessfully" });
  },

  /**
   * This functions creates a new data skeleton populated with random data for 30 days
   * @param {JSON} args - contains the user id passed by the front - end 
   */
  testData: function(args) {
    console.log("testData invoked!");
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
      console.log(scheduleName + " deleted successfully!\nargs: " + JSON.stringify(data));
    },
    function(err) {
      console.log(scheduleName + " couldn't be deleted successfully!\nargs: " + JSON.stringify(err));
    });
  },

  /**
   * This function updates the data skeleton with the new values using data storage API
   * @param {string} uid - ID of the user logged in
   * @param {string} updateObject - js object containing the data to be updated in the data skelton
   * @param {string} message  - passed by the calling function to identify themselves in the logs
   */
  updateDataSkeleton: function(uid, updateObject, message) {
    console.log("message" + updateObject);
    $db.update(uid, "set", updateObject).then(
      function(data) {
        console.log(
          "Success! "+ message +"\nargs: " + JSON.stringify(data)
        );
      },
      function(err) {
        console.log(
          "Failure! "+ message +"\nargs: " + JSON.stringify(err)
        );
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
        console.log(
          "Success! " + message + "\nargs: " + JSON.stringify(data)
        );
      })
      .fail(function(err) {
        console.log(
          "Failure! " + message + "\nargs: " + JSON.stringify(err)
        );
      });
  }
};
