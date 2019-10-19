/***
 * This app is to demonstrate how to use our request model 
 * to leverage Freshdesk public API.
 * ISSUE ID : https://github.com/freshdesk/marketplace-sample-apps/issues/56
 * This app will basically detect the logged in user and tells about all the tickets
 * that are assigned to that agent
* ***/


function openModal() {
    client.interface.trigger('showModal', {
        title: "Related Tickets",
        template: "relatedtickets.html",
        data: loggedInUser
    })
}

$(document).ready( function() {
    app.initialized()
        .then(function(_client) {
            console.info('lala');
          var client = _client;
          window.client = client;
          client.events.on('app.activated',
            function() {
                console.info('lala');
                client.data.get('loggedInUser')
                    .then(function(response) {
                       window.loggedInUser = response.loggedInUser;
                    });
        });
    });
});
