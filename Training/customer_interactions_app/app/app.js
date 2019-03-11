$(document).ready( function() {
    app.initialized()
        .then(function(_client) {
          var client = _client;
            client.data.get("ticket")
              .then(function(data) {
                client.db.set(`ticket: ${data.ticket.id}`, {"interaction_noted": true}, {setIf: "not_exist"})
                  .then(function() {
                      client.db.update(data.ticket.requester_id, "increment", {"Interactions": 1})
                        .then(function(res) {
                          console.log(res);
                        }, function(err) {
                            console.log(err);
                        });

                      client.data.get("loggedInUser").then(function(loggedUser) {
                        //TODO: Add code to append customers' requestor ids' ({customers: [id1, id2]}) as value and agent Id as Key. 
                        
                       }, function(err) {
                          console.log(err);
                       });
                    }, function(err) {
                        console.log(err);
                    })
                },
                function(error) {
                  //handle failure
                  console.log(error);
                }); 
        });
});
