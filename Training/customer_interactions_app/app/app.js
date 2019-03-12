function notify(client, status, message) {
  client.interface.trigger('showNotify', {
    type: status,
    message: message
  });
}

$(document).ready( function() {
    app.initialized()
        .then(function(_client) {
          var client = _client;
          client.events.on('app.activated', function() {
            client.data.get("ticket")
              .then(function(data) {
                client.db.set(`ticket: ${data.ticket.id}`, {"interaction_noted": true}, {setIf: "not_exist"})
                  .then(function() {
                      client.db.update(data.ticket.requester_id, "increment", {"Interactions": 1})
                        .then(function(res) {
                          notify(client, 'success', 'Interaction stored successfully');
                        }, function(err) {
                            notify(client, 'danger', 'Error in stporing interaction');
                        });

                      client.data.get("loggedInUser").then(function(loggedUser) {
                        console.log(loggedUser, "Logged user object");
                        //TODO: Add code to append customers' requestor ids' ({customers: [id1, id2]}) as value and agent Id as Key. 
                        
                       }, function(err) {
                          notify(client, 'danger', 'Error while fetching logged user data');
                          console.log(err);
                       });
                    }, function(err) {
                        notify(client, 'warning', 'Interaction has already been stored for this ticket');
                        console.log(err);
                    })
                }, function(error) {
                  //handle failure
                  notify(client, 'danger', 'Error while fetching ticket details');
                  console.log(error);
                });
          }) 
        });
});
