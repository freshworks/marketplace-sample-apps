/** This app adds a shortcut to start the timer in the top navigation of the
 * ticket detail page. On clicking the app icon, the Start Timer form will be
 * shown.
 */

$(document).ready(function () {
  app.initialized().then(function (_client) {
    var client = _client;

    client.events.on('app.activated', function () {
      client.interface.trigger('showModal', {
        title: 'Start timer',
        template: 'startTimer.html'
      }).then(null, function (error) {
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
  }, function (error) {
    client.interface.trigger('showNotify', {
      type: 'error',
      message: 'Some error has occured in \'Start timer app\'.'
    });
  });
});
