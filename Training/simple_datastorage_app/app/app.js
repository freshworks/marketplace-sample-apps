var noteKey;

function fetchInfo(callback) {
  client.data.get('loggedInUser')
  .then(function(userData) {
    client.data.get('ticket')
    .then(function(ticketData) {
      noteKey = userData.loggedInUser.id + ":" + ticketData.ticket.id;
      callback(ticketData);
    });
  });
}

function displayNote() {
  client.db.get(noteKey)
  .then(function(data) {
    jQuery("#note").val(data.note);
  });
}

function notify(status, message) {
  client.interface.trigger('showNotify', {
    type: status,
    message: message
  });
}

$(document).ready(function() {
  app.initialized()
  .then(function(_client) {
    window.client = _client;
    client.events.on('app.activated', function() {

      fetchInfo(function(ticketData) {
        console.log(ticketData, 'Ticket data');

        displayNote();

        jQuery("#note-save").click(function() {
          let val = jQuery("#note").val();
          if (val == '') {
            notify('warning', 'Note is empty');
            return;
          }
          var noteData = {
            "ticketInfo": {
              "requester_id": ticketData.ticket.requester_id,
              "msg": val,
              "Updated": false
            }
          };

          // Todo: Add ttl to the key

          client.db.set(noteKey, {note: noteData})
          .then(function() {
            notify('success', 'Note has been stored');
          }, function() {
            notify('danger', 'Error storing the note');
          });
        });

       // TODO: Write code here to delete the message

        jQuery("#msg-update").click(function() {
          let val = jQuery("#note").val();
          client.db.update(noteKey, "set", {"note.ticketInfo.msg": val, "note.ticketInfo.Updated": true})
           .then(function() {
             notify('success', 'msg has been updated');
           }, function() {
             notify('danger', 'Error updating the msg');
           });
        });

       // TODO: Write code here to remove the message

      });
    });
  });
});
