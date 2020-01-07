$(document).ready( function() {
  app.initialized().then(function(client) {
    client.events.on('app.activated', function() {
         // sample code for DatastoreAPI
      client.db.set('tutorialDemo', {message: 'ok'})
        .then(
          function(data) {
            console.log('DatastoreAPI:Set:tutorialDemo', data);
          }, 
          function(error) {
            console.log('DatastoreAPI:Set:tutorialDemo', error);
          }
        );

        client.db.get('tutorialDemo')
        .then(
          function(data) {
            console.log('DatastoreAPI:Get:tutorialDemo', data);
          }, 
          function(error) {
            console.log('DatastoreAPI:Get:tutorialDemo', error);
          }
        );
      });
    });
});
