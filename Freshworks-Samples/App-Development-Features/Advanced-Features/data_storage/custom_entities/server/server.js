exports = {
  events: [{
    event: 'onTicketUpdate',
    callback: 'onTicketUpdateHandler'
  }, ],
  onTicketUpdateHandler: function (args) {
    console.log("OnTicketUpdate handler fired.");
    let ticket = args.data.ticket;
    console.log("Check if ticket is closed. Ticket status : ", ticket.status);
    if (ticket.status == "5") {
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
      appointmentRecords.then((i) => {
        restaurants.get(i.records[0].data.restaurant_id).then((d) => {
          console.log("Restaurant with matching ticket id ", d.record.data);
          let uObj = d.record.data;
          uObj.status = "3";
          restaurants.update(d.record.display_id, uObj)
            .then((r) => {
              console.log("Update success");
              console.log(r);
            }, (err) => {
              console.error("Update failed!");
              console.error(err);
            })
        })
      })
    }
  }
};