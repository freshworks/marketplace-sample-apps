exports = {
  /** registering the event along with its callback function */
  events: [{ event: "onScheduledEvent", callback: "scheduledEventHandler" }],

  /**
   * This is the initial method called by the pomodoro app
   * This method is responsible for setting up data skeleton and schedules
   * This is invoked using the SMI
   * @param {JSON} args - id of the user passed by the front-end using SMI call
   */
  startPomodoro: function(args) {
    let promise1 = this.prepareForNextDay(args.id);
    let promise2 = this.startSessions(args.id);
    let obj = this;
    Promise.all([promise1, promise2])
      .then(() => {
        
        let td = 0;
        let hs = [{ noOfSessions: 0, noOfInterruptions: 0 }];
        obj.getDataSkeleton(args.id).then(

          () => {renderData(null, {})},

          () => {
            obj.createDataSkeleton(args.id, { totalDays: td, history: hs })
            .then(

              () => renderData(null, {}),

              err => {
                console.error("couldn't create data skeleton in startPomodoro\n%o", err);
                renderData({ status: err.status, message: err.message })
              }

            );
          }

        );

      },
      
      err => {
        console.error("Error in startPomodoro promises\n%o", err);
        renderData({ status: err.status, message: err.message });
      });

  },

  /**
   * Handler funtion for both scheduled events
   * @param {object} args - data passed by scheduled events which inclues ID of the user and the type of schedule calling the handler
   */
  scheduledEventHandler: function(args) {

    obj = this;
    if (args.data.type == "regular") {

      obj.getDataSkeleton(args.data.id).then(

        function(data) {
          let td = data.totalDays;
          let hs = data.history;
          hs[td].noOfSessions += 1;
          obj.updateDataSkeleton(args.data.id, { history: hs })
          .then(null, err => console.error("couldn't update session info in scheduledEventHandler\n%o", err));
        },
        function(err) {
          console.error("couldn't fetch data in scheduledEventHandler for updating sessions\n%o", err);
        }
      );

    } else {
      
      obj.getDataSkeleton(args.data.id).then(

        function(data) {
        td = data.totalDays;
        hs = data.history;
        data.totalDays < 29 ? td += 1 : hs.shift();
        hs.push({ noOfSessions: 0, noOfInterruptions: 0 });
        obj.updateDataSkeleton(args.data.id, { history: hs })
        .then(null, err => console.error("couldn't update data skeleton for next dayin scheduledEventHandler\n%o", err));
        },
        
      function(err) {
        console.error("couldn't fetch data in scheduledEventHandler to prepare for next day\n%o", err);
        }
      );
    
    }

  },

  /**
   * This function deletes the schedule and records the event as an interruption as this will be fired only when the session is interrupted
   * @param {JSON} args - conatins the user id passed by the front - end
   */
  interruptSchedule: function(args) {

    let obj = this;
    let promise1 = obj.removeSchedule("regular_schedule");
    obj.getDataSkeleton(args.id).then(

      function(data) {
        let td = data.totalDays;
        let hs = data.history;
        hs[td].noOfInterruptions += 1;
        let promise2 = obj.updateDataSkeleton(args.id, { history: hs });
        Promise.all([promise1, promise2])
        .then(() => renderData(null, {}), err => {
          console.error("promise error in intteruptSchedule method\n%o", err);
          renderData(err);
        });
      },

      function(err) {
        console.error("couldn't fetch data in interruptSchedule\n%o", err);
        renderData(err);
      }

    );

  },

  /**
   * only deletes schedule without recording interruption
   */
  stopSchedule: function() {

    this.removeSchedule("regular_schedule")
    .then(() => renderData(null, {}), err => {
      console.error("couldn't delete regular_schedule\n%o", err);
      renderData(err)
    });

  },

  /**
   * This function deletes all schedules and data, essensitally making it a blank slate
   * @param {JSON} args - conatins the user id passed by the front - end
   */
  clearActivity: function(args) {

    this.removeSchedule("Increment_Day");
    this.removeSchedule("regular_schedule");
    $db.delete(args.id)
    .then(() => renderData(null, {}), err => {
      console.error("Error in clear activity\n%o", err);
      renderData(err)
    });

  },

  /**
   * This functions creates a new data skeleton populated with random data for 30 days
   * @param {JSON} args - contains the user id passed by the front - end
   */
  generateTestData: function(args) {

    let uid = args.id;
    let td = 29;
    let hs = [];
    for (let i = 0; i < 29; i++) {
      hs.push({
        noOfSessions: Math.ceil(Math.random() * 10),
        noOfInterruptions: Math.ceil(Math.random() * 10)
      });
    }
    this.createDataSkeleton(uid,{ totalDays: td, history: hs })
    .then(() => renderData(null, {}), err => {
      console.error("couldn't create data skeleton in generateTestData\n%o", err);
      renderData(err)
    });

  },

  /**
   * This function deletes the schedule passed to it
   * @param {string} scheduleName - name of the schedule to be deleted
   * @returns {promise} returns the promise of schedule.delete async function call
   */
  removeSchedule: function(scheduleName) {
    return $schedule.delete({ name: scheduleName });
  },

  /**
   * This function updates the data skeleton with the new values using data storage API
   * @param {string} user_id - ID of the user logged in
   * @param {string} updateObject - js object containing the data to be updated in the data skelton
   * @returns {Promise} returns the promise of the data storage API
   */
  updateDataSkeleton: function(user_id, updateObject) {
    return $db.update(user_id, "set", updateObject);
  },

  /**
   * This function updates the data skeleton with the new values using data storage API
   * @param {string} user_id - ID of the user logged in
   * @param {string} dataObject - js object containing the data to create the skeleton with
   * @returns {Promise} returns promise of data storage API
   */
  createDataSkeleton: function(user_id, dataObject) {
    return $db.set(user_id, dataObject, { setIf: "not_exist" });
  },

  /**
   * This function retrieves the data skeleton
   * @param {string} user_id - id of the user
   * @returns {Promise} returns the promise of the Data storage API
   */
  getDataSkeleton: function(user_id) {
    return $db.get(user_id);
  },

  /**
   * a function to create a one time scheduled event, we also pass the type of schedule and id to the scheduledEventHandler using data object
   * so that the handler can distinguish between different schedules and manipulate data accordingly
   * @summary function to create one time scheduled event to prepare for next day
   * @param {string} user_id - id of the user passed by the startPomodoro function
   * @returns {Promise} returns the promise of the scheduled event creator
   */
  prepareForNextDay: function(user_id) {
    $schedule.fetch({ name: "Increment_Day" }).then(null, () => {
      
      let x = new Date();
      x.setHours(0, 0, 0, 0);
      x.setDate(x.getDate() + 1);
      x = x.toISOString();
      
      return $schedule.create({
        name: "Increment_Day",
        data: { type: "incrementDay", id: user_id },
        schedule_at: x
      });
    
    });
  
  },

  /**
   * a function to create a recurring schedule, we also pass the type of schedule and id to the scheduledEventHandler using data object
   * so that the handler can distinguish between different schedules and manipulate data accordingly
   * @summary function to create recurring schedule
   * @param {string} user_id - id of the user passed by the startPomodoro function
   * @returns {Promise} returns the promise of the scheduled events creator
   */
  startSessions: function(user_id) {

    return $schedule.create({
      name: "regular_schedule",
      data: { type: "regular", id: user_id },
      schedule_at: new Date().toISOString(),
      repeat: {
        time_unit: "minutes",
        frequency: 25
      }
    });

  }

};
