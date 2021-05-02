var newAppointment = {};
// Enum for Ticket priority, status & catalog status
const
  TICKET_PRIORITY = {
    low: 1
  },
  TICKET_STATUS = {
    open: 2
  },
  CATALOG_STATUS = {
    in_progress: "2"
  };

/**
 * Get a single restaurant record
 */
function getRestaurantDetails() {
  return new Promise(function (resolve, reject) {
    restaurant.get(newAppointment.restaurant_id)
      .then(function (data) {
        resolve(data.record.data);
      })
      .catch(function (error) {
        console.error(error);
        reject(error);
      });
  });
}
/**
 * Create ticket for an appointment record
 * @param {object} restaurant - Restaurant details passed via an object
 */
function createTicketForAppointment(restaurant) {
  return new Promise(function (resolve, reject) {
    client.request.post("<%= iparam.domain %>/api/v2/tickets", {
        headers: {
          "Authorization": "Basic <%= encode(iparam.apikey) %>",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: TICKET_STATUS.open,
          priority: TICKET_PRIORITY.low,
          description: newAppointment.notes,
          subject: "Appointment for " + restaurant.name,
          email: "example@example.com"
        })
      })
      .then(function (data) {
        resolve({
          restaurant,
          ticket: data
        });
      })
      .catch(function (error) {
        notify(`danger`, `Ticket creation step failed!`);
        console.error(error);
        reject(error);
      })
  });
}
/**
 * Create an appointment record based on ticket and restaurant details
 * @param {object} data - Contains both ticket and restaurant details
 */
function createAppointmentRecord(data) {
  return new Promise(function (resolve, reject) {
    var ticket = JSON.parse(data.ticket.response);
    newAppointment.ticket_id = String(ticket.id);
    newAppointment.restaurant_info = data.restaurant.name;
    // Field Validations
    appointment.create(newAppointment)
      .then(function () {
        // Close the instance and show success popup. Repopulate the entries in the list
        client.instance.send({
          message: {
            action: "notification",
            type: "success",
            message: "Appointment added successfully!"
          }
        });
        client.instance.close();
        resolve(data);
      })
      .catch(function (error) {
        // Show the error alone
        notify(`danger`, `Something went wrong. Record creation failed with the following error :"${error.message}". Refer  to console for further details`)
        console.error(error);
        reject(error);
      })
  });
}
/**
 * Updates the status of the restaurant record to `In Progress`
 * @param {object} data - Contains restaurant details
 */
function updateRestaurantRecord(data) {
  return new Promise(function (resolve, reject) {
    restaurant.update(newAppointment.restaurant_id, {
        name: data.restaurant.name,
        short_code: data.restaurant.short_code,
        description: data.restaurant.description,
        photo_url: data.restaurant.photo_url,
        location_pin: data.restaurant.location_pin,
        status: CATALOG_STATUS.in_progress
      })
      .then(function () {
        resolve(data);
      })
      .catch(function (error) {
        notify(`danger`, `Updating restaurant record failed`);
        reject(error);
      });
  });
}
/**
 * Obtain `client` object and references to 'appointments' & 'restaurants' entities
 */
document.addEventListener('DOMContentLoaded', function () {
  app.initialized().then(function (client) {
    window.client = client;
    var entity = client.db.entity({
      version: 'v1'
    });
    window.appointment = entity.get("appointments");
    window.restaurant = entity.get("restaurants");
    client.instance.resize({
      height: "1500px"
    });
    client.instance.context()
      .then(function (context) {
        var st = new Date(context.data.startAt);
        // Obtain the selected slot date 
        var st_date = st.toISOString().split('T')[0];
        // Obtain the selected slot time
        var st_time = String(st.getHours()).padStart(2, '0') + ":00";
        // Set the date and time fields in the appointment modal. 
        // If there is no time value (result of clicking directly in the Calendar Week view), it is set to 09:00 hrs
        document.getElementById("date").value = st_date;
        if (!st_date.length < 11) {
          document.getElementById("time").value = st_time;
        } else {
          document.getElementById("time").value = "09:00";
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  });
});

/**
 * Create appointment
 */
function createAppointment() {
  newAppointment = {
    restaurant_id: getValueOf("id"),
    restaurant_info: "",
    ticket_id: "00",
    appointment_date: getValueOf("date") + 'T' + getValueOf("time") + ":00.000Z",
    notes: getValueOf("notes"),
    booked_slot: parseInt(getValueOf("time").split(":")[0])
  }
  if (newAppointment.restaurant_id.length < 1 && newAppointment.notes < 1) {
    notify(`danger`, `Check if the fields are properly filled`);
    return
  }
  getRestaurantDetails()
    .then(createTicketForAppointment)
    .then(createAppointmentRecord)
    .then(updateRestaurantRecord)
    .catch(function (error) {
      notify(`danger`, 'Something went wrong while creating an appointment');
      console.error(error);
    });
}

/**
 * Get value of an input field based on its ID
 * @param {string} id - ID of the input field
 */
function getValueOf(id) {
  return document.getElementById(id).value;
}

/**
 * Displays a notification
 * @param {string} type Type of notification
 * @param {string} message The message to display in the notification
 */
function notify(type, message) {
  client.instance.send({
    message: {
      action: "notification",
      type,
      message
    }
  });
}
