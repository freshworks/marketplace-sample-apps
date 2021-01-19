/**
 * Enum for Catalog Status.
 */
const TICKET_STATUS = {
  pending: "3",
  closed: "5"
};

// Listen to `onTicketUpdate` event. 
exports = {
  events: [{
    event: 'onTicketUpdate',
    callback: 'onTicketUpdateHandler'
  }],
  onTicketUpdateHandler: function (args) {
    console.log("OnTicketUpdate handler fired.");
    let ticket = args.data.ticket;
    console.log("Check if ticket is closed. Ticket status : ", ticket.status);
    if (ticket.status == TICKET_STATUS.closed) {
      console.log("Ticket has been closed. Updating the respective restaurant record based on the ticket ID filter");
      let ticket_id = ticket.id;
      let entity = $db.entity({
        version: "v1"
      });
      let appointments = entity.get("appointments");
      let restaurants = entity.get("restaurants");
      let appointmentRecords = appointments.getAll({
        query: {
          ticket_id
        }
      });
      appointmentRecords.then((appointment) => {
        restaurants.get(appointment.records[0].data.restaurant_id).then((restaurant) => {
          console.log("Restaurant with matching ticket id ", restaurant.record.data);
          let updatedObj = restaurant.record.data;
          updatedObj.status = TICKET_STATUS.pending;
          restaurants.update(restaurant.record.display_id, updatedObj)
            .then((updatedRecord) => {
              console.log("Update success");
              console.log(updatedRecord);
            }, (err) => {
              console.error("Update failed!");
              console.error(err);
            })
        })
      })
    }
  }
};
