/** This app adds a shortcut to start the timer in the top navigation of the
 * ticket detail page. On clicking the app icon, the Start Timer form will be
 * shown.
 */
document.addEventListener('DOMContentLoaded', function () {

  /**
  * Initialize channel
  * @param {object} _client - Object containing all the client details
  */
  app.initialized().then(function (_client) {
    var client = _client;

    client.events.on('app.activated', function () {
      /**
      * Opens modal to collect params to start timer Interface API
      */
      client.interface.trigger('showModal', {
        title: 'Start timer',
        template: 'startTimer.html'
      }).then(null, function () {
        client.interface.trigger('showNotify', {
          type: 'error',
          message: 'Some error has occured in \'Start timer app\'.'
        });
      });
    });
    client.instance.receive(function (event) {
      var data = event.helper.getData();

      if (data.message.agent) {
        client.interface.trigger('start', {
          id: 'timer',
          value: data.message
        });
      }
    });
  },
    /**
     * This throws an error notification
     * @param {string} error -The string error message
     */
    function (error) {
      client.interface.trigger('showNotify', {
        type: 'error',
        message: `Some error ${error} has occured in \'Start timer app\'.`
      });
    });
});
