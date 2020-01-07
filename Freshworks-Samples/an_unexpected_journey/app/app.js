
function displayOverview() {
    let base_url = 'https://api.themoviedb.org/3/search/movie';
    let query = 'an+unexpected+journey';
    client.request.get(`${base_url}?api_key=<%= iparam.api_key %>&language=en-US&query=${query}&page=1&include_adult=false`, {})
        .then(
            function(data) {
                if (data.status != 200) {
                    displayMessage('danger', 'It isn\'t a good morning');
                    return;
                }
                let response = JSON.parse(data.response);
                for (let result in response.results) {
                    let overview = response.results[0].overview;
                    displayMessage('success', overview);
                    break;                  
                }
            },
            function(error) {
                displayMessage('danger', 'Is it really a good morning?');
            }
    );
}

function lookForBaggins() {
    // Fetch the current logged-in user
    let is_baggins = false;
    client.data.get('loggedInUser').then(
        function(data) {
            current_user = data.loggedInUser.contact.name;
            if (current_user.indexOf('Baggins') >= 0) {
                is_baggins = true;
            }
            if (is_baggins) {
                // Force set the priority to urgent
                client.interface.trigger("setValue", {id: "priority", value: 4});
                // Disable Ticket Priority
                client.interface.trigger('disable', { id: 'priority'});
                client.events.on('ticket.agentChanged', onPropertyChange);
            }
        },
        function(error) {
            displayMessage('danger', 'Baggins has put on his ring');
        }
    );
}

function onPropertyChange(event) {
    let event_data = event.helper.getData();
    displayMessage('danger', 'Release the Orcs!');
}

function displayMessage(type, message) {
    client.interface.trigger('showNotify', { type: type, message: message});
}

$(document).ready( function() {
  // Initialize channel
  app.initialized().then(function(_client) {
    window.client = _client;
    // App activate callback
    client.events.on('app.activated', function() {
        lookForBaggins();
        displayOverview();
    });
  });
});
