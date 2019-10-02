/**
 * Show modal to schedule a note
 * 
 */
function showScheduleNoteModal() {
  client.interface.trigger('showModal', {
    title: 'Schedule a Note',
    template: 'modal.html',
    data: {}
  });
}

/**
 * Show a notification toast 
 * 
 * @param {object} payload - contains type & message
 */
function notify(payload) {
  client.interface.trigger('showNotify', payload);
}

$(document).ready( function() {
  app.initialized().then(function(client) {
    window.client = client;

    client.events.on('app.activated', function() {
      showScheduleNoteModal();
    });
    
    /**
     * Handler to receive events from modal instance to perform actions on
     * client. 
     * 
     * @param {object} event - Instance Event
     */
    client.instance.receive(function(event) {
      const data = event.helper.getData().message;

      client[data.api][data.action](data.method, data.payload);
    });
  });
});
