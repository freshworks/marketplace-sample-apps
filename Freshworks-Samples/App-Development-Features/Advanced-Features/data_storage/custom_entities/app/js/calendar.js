/**
 * Initializes a calendar with defaults and event handlers
 */
function initializeCalendar() {
  var calendarEl = document.getElementById('calendar');
  window.calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    slotDuration: '01:00:00',
    expandRows: true,
    height: '100%',
    selectable: true,
    eventBorderColor: '#000',
    businessHours: {
      startTime: '06:00',
      endTime: '19:00',
    },
    headerToolbar: {
      left: 'prev,today,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: function (info, successCallback) {
      // Programmatically generate events from Custom Objects
      loadAppointments(successCallback);
    },
    select: function (date) {
      // A select event triggers appointment creation
      showNewAppointmentModal(date);
    },
    eventClick: function (info) {
      // Clicking on an event takes you to the ticket associated with an appointment
      var ticketUrl = info.event.extendedProps.ticketUrl;
      if (ticketUrl) {
        window.open(ticketUrl, "_blank");
      }
    }
  });
  calendar.render();
}

/**
 * Opens the new appointment modal. Passes the selected date time range as contextual information
 * @param {*} date - Date associated with the calendar date time select event
 */
function showNewAppointmentModal(date) {
  client.interface.trigger("showModal", {
    title: "Add Appointment",
    template: "./modal/appointment.html",
    data: {
      startAt: date.startStr,
      endAt: date.endStr
    }
  }).catch(function (error) {
    notify("danger", "Something went wrong while opening the new appointment dialog");
    console.error(error);
  });
}

/**
 * Creates a new calendar event object that the FullCalendar library expects
 * @param {object} appointment - Appointment data
 * @param {string} domain - The FD account domain name from the iparams data 
 */
function createCalendarEventObj(appointment, domain) {
  return {
    id: appointment.display_id,
    title: `(${appointment.display_id}) - ${appointment.data.restaurant_info} - ${appointment.data.notes}`,
    start: new Date(Date.parse(appointment.data.appointment_date)).toISOString().split(".")[0],
    backgroundColor: hashCode(appointment.data.restaurant_info),
    extendedProps: {
      ticketUrl: domain + "/a/tickets/" + appointment.data.ticket_id
    }
  }
}
