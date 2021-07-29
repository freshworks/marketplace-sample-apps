function fetchSchedule(scheduleName, callback) {
  client.request
    .invoke("fetchSchedule", {
      scheduleName: scheduleName,
    })
    .then(
      function (data) {
        callback(null, data.response);
      },
      function (err) {
        callback(err);
      }
    );
}

function deleteSchedule(scheduleName, callback) {
  client.request
    .invoke("deleteSchedule", {
      scheduleName: scheduleName,
    })
    .then(
      function (data) {
        callback(null, data);
      },
      function (err) {
        callback(err);
      }
    );
}

function removeScheduleFromList(scheduleName, callback) {
  getListOfSchedules(loggedInUserId, function (data) {
    delete data.list[scheduleName];
    client.db.set(`schedules_${loggedInUserId}`, data).then(function () {
      renderListOfSchedules();
      callback();
    });
  });
}

function addListeners() {
  q("body").addEventListener("click", function (event) {
    const targetElement = event.target;
    if (targetElement.matches(".edit-logo")) {
      editHandler(targetElement);
    }
    if (targetElement.matches(".delete-logo")) {
      deleteHandler(targetElement);
    }
  });

  // Listener to edit a schedule
  function editHandler(element) {
    var scheduleName =
      element.parentElement.closest(".schedule-li").dataset.scheduleName;

    // With the scheduleName,
    fetchSchedule(scheduleName, function (err, data) {
      if (err) {
        return sendNotification("danger", `Error fetching the schedule`);
      }
      client.instance.send({
        message: {
          type: "openScheduleDetail",
          scheduleData: data,
        },
      });
    });
  }

  // Listener to delete a schedule
  function deleteHandler(element) {
    var scheduleName =
      element.parentElement.closest(".schedule-li").dataset.scheduleName;

    deleteSchedule(scheduleName, function (err, data) {
      if (err) {
        return sendNotification("danger", `Error deleting the schedule`);
      }
      removeScheduleFromList(scheduleName, function () {
        sendNotification("success", "Schedule deleted");
      });
    });
  }
}

function getListOfSchedules(userId, callback) {
  client.db.get(`schedules_${userId}`).then(callback, function (err) {
    if (err.status == 404) {
      callback({ list: {} });
    }
  });
}

function renderListOfSchedules() {
  getListOfSchedules(loggedInUserId, function (schedules) {
    if (Object.keys(schedules.list).length > 0) {
      document.getElementById("schedules-ul").innerHTML = "";
      for (var scheduleName in schedules.list) {
        document.getElementById("schedules-ul").insertAdjacentHTML(
          "beforeend",
          `
        <li data-schedule-name="${scheduleName}" class="row schedule-li">
            <a class="schedule-title">${schedules.list[scheduleName]}</a>
              <div>
                <a class="action-icon"><img class="edit-logo"/></a>
                <a class="action-icon"><img class="delete-logo"/></a>
              </div>
          </li>`
        );
      }
    } else {
      document.getElementById("schedules-ul").innerHTML = "No schedules found.";
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  addListeners();
  app.initialized().then(function (_client) {
    window.client = _client;
    client.data.get("loggedInUser").then(function (user) {
      window.loggedInUserId = user.loggedInUser.id;
      renderListOfSchedules();
    });
  });
});
