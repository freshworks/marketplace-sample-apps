var noteKey;

function fetchInfo(callback) {
  client.data.get('loggedInUser')
  .then(function(userData) {
    client.data.get('ticket')
    .then(function(ticketData) {
      noteKey = userData.loggedInUser.id + ":" + ticketData.ticket.id;
      callback();
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
      fetchInfo(function() {

        displayNote();

        jQuery("#note-save").click(function() {
          var noteData = jQuery("#note").val();
          if (noteData == '') {
            notify('warning', 'Note is empty');
            return;
          }
          client.db.set(noteKey, { note: noteData})
          .then(function() {
            notify('success', 'Note has been stored');
          }, function() {
            notify('danger', 'Error storing the note');
          });
        });

        jQuery("#note-delete").click(function() {
          client.db.delete(noteKey)
          .then(function() {
            jQuery("#note").val('');
            notify('success', 'Note has been deleted');
          }, function() {
            notify('danger', 'Error deleting the note');
          });
        });
      });
    });
  });
});
