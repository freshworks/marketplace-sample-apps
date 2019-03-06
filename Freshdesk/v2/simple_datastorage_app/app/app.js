/**
 * @desc - This app allows you to save a memo linked to the ticket
 * @info - https://developers.freshdesk.com/v2/docs/data-storage/
 */
let noteKey;

/** Fetch Info of userData and ticketData from the current tickt page */
function fetchInfo(callback) {
  client.data.get('loggedInUser').then((userData) => {
    client.data.get('ticket').then((ticketData) => {
      noteKey = userData.loggedInUser.id + ":" + ticketData.ticket.id;
      callback();
    });
  });
}

/** @fires - Gets the data from db and populates #note element */
function displayNote() {
  client.db.get(noteKey).then((data) => {
    jQuery("#note").val(data.note);
  });
}
/** @fires - Notification pop on top right corner */
function notify(status, message) {
  /** @info - https://developers.freshdesk.com/v2/docs/interface-api/ */
  client.interface.trigger('showNotify', {
    type: status,
    message: message
  });
}

$(document).ready(() => {
  app.initialized().then((_client) => {
    window.client = _client;
    client.events.on('app.activated',() => {
      fetchInfo(() => {
        
        displayNote();
        jQuery("#note-save").click(() => {
          var noteData = jQuery("#note").val();
          if (noteData == '') {
            notify('warning', 'Note is empty');
            return;
          }
          client.db.set(noteKey, { note: noteData}).then(() => {
            notify('success', 'Note has been stored');
          }, () => {
            notify('danger', 'Error storing the note');
          });
        });
        jQuery("#note-delete").click(() => {
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
