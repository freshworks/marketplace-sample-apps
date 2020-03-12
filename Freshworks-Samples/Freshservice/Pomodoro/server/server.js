
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
    // $schedule
    //   .fetch({
    //     name: "Increment_Day"
    //   })
    //   .then(
    //     function(data) {
    //       console.log("schedule already defined for the day, %o", data);
    //     },
    //     function(err) {
    //       console.log("initializing for the day!");
    //       console.log(JSON.stringify(err));
    //       let x = new Date();
    //       x.setHours(0, 0, 0, 0);
    //       x.setDate(x.getDate() + 1);
    //       x = x.toISOString();
    //       $schedule.create({
    //         name: "Increment_Day",
    //         data: {type: "incrementDay", id: uid},
    //         schedule_at: x
    //       })
    //         .then(
    //           function(data) {
    //             console.log("incrementDay successfully created, %o", data);
    //           },
    //           function(err) {
    //             console.error("Couldn't create incrementDay, %o", err);
    //           }
    //         );
    //     }
    //   );
    let promise1 = this.cleanUpDay(args.id);
    // $schedule.create({
    //     name: "regular_schedule",
    //     data: { type: "regular", id: uid },
    //     schedule_at: new Date().toISOString(),
    //     repeat: {
    //       time_unit: "minutes",
    //       frequency: 25
    //     }
    //   })
    //   .then(
    //     function(data) {
    //       console.log("regular_schedule created sucessfully, %o", data);
    //     },

    //     function(err) {
    //       console.error("regular_schedule couldn't be created, %o", err);
    //     }
    //   );
    let promise2 = this.startSessions(args.id);
    Promise.all([promise1, promise2])
    .then(() => {
      let td = 0;
      let hs = [ {noOfSessions: 0, noOfInterruptions: 0} ]
      this.createDataSkeleton(uid, {totalDays: td, history: hs}, "Initial")
      .then(() => renderData(null, { reply: "ok" }), (err) => renderData(err));
    },
    (err) => renderData(err));
    // renderData(null, { reply: "created events sucessfully" });
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
          obj.updateDataSkeleton(args.data.id, {history: hs}, "regular")
          .then(null, (err) => console.error("%o", err));
        },
        function(err) {
          console.error("%o", err);
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
        obj.updateDataSkeleton(args.data.id, {history: hs}, "end Day")
        .then(null, (err) => console.error("%o", err));
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
    let promise1 = obj.removeSchedule("regular_schedule")
      // .then(null, (err) => {console.error("%o", err);renderData(err)});
      $db.get(uid).then(
        function(data) {
          td = data.totalDays;
          hs = data.history;
          hs[td].noOfInterruptions += 1;
          let promise2 = obj.updateDataSkeleton(uid, {history: hs}, "recorded interruption")
          // .then(() => renderData(null, {reply: "ok"}), (err) => renderData(err));
          Promise.all([promise1, promise2])
          .then(() => renderData(null, {reply: "ok"}), (err) => renderData(err));
        },
        function(err) {
          // console.error("Couldn't fetch data from interruptSchedule method, %o", err);
          console.error("%o", err);
          renderData(err);
        }
      );
    // renderData(null, { reply: "deleted events sucessfully" });
  },

  /**
   * only deletes schedule without recording interruption
   * @param {JSON} args - contains the user id passed by the front - end
   */
  stopSchedule: function() {
    this.removeSchedule("regular_schedule")
    .then(() => renderData(null, {reply: "ok"}), (err) => renderData(err));
  },

  /**
   * This function deletes all schedules and data, essensitally making it a blank slate
   * @param {JSON} args - conatins the user id passed by the front - end
   */
  clearActivity: function(args) {
    this.removeSchedule("Increment_Day");
    this.removeSchedule("regular_schedule");
    $db.delete(args.id)
    .then(() => renderData(null, { reply: "ok" }), (err) => renderData(err));
    // .then(
    //   function(data) {
    //     console.info("Data cleaning succeeded, %o", data);
    //   },
    //   function(err) {
    //     console.error("Data cleaingfailed, %o", err);
    //   }
    // );
    // renderData(null, { reply: "deleted events sucessfully" });
    // Promise.all([promise1, promise2, promise3])
    // .then(() => renderData(null, { reply: "ok" }), (err) => renderData(err));
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
    this.createDataSkeleton(uid, { totalDays: td, history: hs }, "Test Data")
    .then(() => renderData(null, { reply: "ok" }), (err) => renderData(err));
    // renderData(null, { reply: "Test data updated sucessfully" });
  },

  /**
   * This function deletes the schedule passed to it
   * @param {string} scheduleName - name of the schedule to be deleted
   */
  removeSchedule: function(scheduleName) {
    return $schedule.delete({name: scheduleName})
    // .then(function(data) {
    //   console.log("%s deleted successfully!, %o", scheduleName, data);
    // },
    // function(err) {
    //   console.error("%s couldn't be deleted successfully!, %o", scheduleName, err);
    // });

  },

  /**
   * This function updates the data skeleton with the new values using data storage API
   * @param {string} uid - ID of the user logged in
   * @param {string} updateObject - js object containing the data to be updated in the data skelton
   * @param {string} message  - passed by the calling function to identify themselves in the logs
   */
  updateDataSkeleton : function(uid, updateObject, message) {
    return $db.update(uid, "set", updateObject)
    // .then(
    //   function(data) {
    //     console.log("Success %s : %o", message, data);
    //   },
    //   function(err) {
    //     console.error("Failure %s err: %o", message, err);
    //   }
    // );
  },

  /**
   * This function updates the data skeleton with the new values using data storage API
   * @param {string} uid - ID of the user logged in
   * @param {string} dataObject - js object containing the data to create the skeleton with
   * @param {string} message  - passed by the calling function to identify themselves in the logs
   */
  createDataSkeleton: function(uid, dataObject, message) {
    return $db.set(uid, dataObject, {setIf: "not_exist"})
      // .done(function(data) {
      //   console.log("Success %s : %o", message, data);
      // })
      // .fail(function(err) {
      //   console.error("Failure %s err: %o", message, err);
      // });
  },

  cleanUpDay: function(args) {
    $schedule.fetch({name: "Increment_Day"})
    .then(null, () => {
      let x = new Date();
      x.setHours(0, 0, 0, 0);
      x.setDate(x.getDate() + 1);
      x = x.toISOString();
      return $schedule.create({
        name: "Increment_Day",
        data: {type: "incrementDay", id: args},
        schedule_at: x
      })
    });
  },

  startSessions: function(args) {
    return $schedule.create({
      name: "regular_schedule",
      data: { type: "regular", id: args },
      schedule_at: new Date().toISOString(),
      repeat: {
        time_unit: "minutes",
        frequency: 25
      }
    })
  }
};
