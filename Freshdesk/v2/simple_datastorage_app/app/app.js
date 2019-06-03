
/**
 * @desc - This app allows you to save a memo linked to the ticket
 * @info - https://developers.freshdesk.com/v2/docs/data-storage/
 */

let noteKey;

$(document).ready(()=>{
(function(){
  app.initialized(_client).then(()=>{
    window.client = _client;
    client.events.on('app.activated',()=>{
      fetchInfo(()=>{
        displayNote();
        $("#note-save").click(()=>{
          savenote();
        });
        $("#note-delete").click(()=>{
          deletenote();
        });
      });
    })
  },(err)=>{
    showerror();
  });


  function showerror(){
    client.interface.trigger("showNotify", {
      type: "warning", title: "Warning",
      message: "Error: App is facing issues during initialzation"
    }).then(function(data) {
    console.log(`Err: Interface API - ${data}`);
    }).catch(function(error) {
    console.log(`Some error Encountered: ${error}`);
    });
  }

  function savenote(){
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
  }

  function deletenote(){
    client.db.delete(noteKey)
      .then(function() {
        jQuery("#note").val('');
        notify('success', 'Note has been deleted');
      }, function() {
        notify('danger', 'Error deleting the note');
      });
  }

  function displayNote(){
    client.db.get(noteKey).then((data)=>{
      $("#note").val(data.note);
    });
  }

  function notify(status,message){
    client.interface.trigger('showNotify',{
      type: status,
      message: message
    });
  }

  function fetchInfo(callback){
    client.data.get('loggedInUser').then((userData)=>{
      client.data.get('ticket').then((ticketData)=>{
        noteKey = `${userData.loggedInUser.id} : ${ticketData.ticket.id}`;
        callback();
      });
    });
  }
})();
});