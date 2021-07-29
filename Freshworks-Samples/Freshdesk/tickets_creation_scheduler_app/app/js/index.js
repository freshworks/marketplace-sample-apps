function openScheduleDetailModal(title, modalData) {
  client.interface.trigger("showModal", {
    title: title,
    template: "schedule_detail.html",
    data: modalData || {},
  });
}

function openListSchedulesModal() {
  client.interface.trigger("showModal", {
    title: "List of schedules",
    template: "list_schedules.html",
  });
}

function addListeners() {
  q("#create-schedule").addEventListener("click", function () {
    openScheduleDetailModal("Create Schedule", {
      newSchedule: true,
    });
  });

  q("#list-schedules").addEventListener("click", function () {
    openListSchedulesModal();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  addListeners();

  app.initialized().then(function (_client) {
    window.client = _client;

    client.instance.resize({
      height: "100px",
    });

    client.instance.receive(function (event) {
      var data = event.helper.getData();

      switch (data.message.type) {
        case "showNotification":
          client.interface.trigger("showNotify", data.message.args);
          break;

        case "openScheduleDetail":
          openScheduleDetailModal("Update Schedule", {
            newSchedule: false,
            scheduleData: data.message.scheduleData,
          });
          break;
      }
    });
  });
});
