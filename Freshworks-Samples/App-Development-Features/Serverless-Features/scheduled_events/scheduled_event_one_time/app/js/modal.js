/**
 * Construct and return schedule data
 *
 * @returns {object} scheduleData
 */
function getScheduleData() {
  const date = new Date();

  /**
   * Add hour (delay) based on the dropdown select to current time to construct
   * time at which the event has to be triggered.
   */
  date.setHours(
    date.getHours() + Number(document.getElementById("schedule-hours").value)
  );

  const scheduleData = {
    ticket_id: ticket.id,
    note: document.getElementById("note").value,
    schedule_at: date.toISOString(),
  };

  return scheduleData;
}

/**
 * Set of event listeners on DOM
 */
function addListeners() {
  document
    .getElementById("create-schedule")
    .addEventListener("click", function () {
      client.request.invoke("createSchedule", getScheduleData()).then(
        function () {
          notifyParent("success", "Note has been scheduled");
        },
        function () {
          notifyParent("danger", "Unable to schedule note");
        }
      );
    });
}

/**
 * Request parent instance to display a notification and close the current modal
 *
 * @param {string} type - Type of notification
 * @param {string} message - Content of notification
 */
function notifyParent(type, message) {
  client.instance.send({
    message: {
      api: "interface",
      action: "trigger",
      method: "showNotify",
      payload: {
        type: type,
        message: message,
      },
    },
  });

  tearDownModal();
}

/**
 * Close the current modal
 */
function tearDownModal() {
  client.instance.close();
}

document.addEventListener("DOMContentLoaded", function () {
  app.initialized().then(function (_client) {
    window.client = _client;

    client.data.get("ticket").then(function (data) {
      window.ticket = data.ticket;
    });
  });

  addListeners();
});
