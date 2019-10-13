
$(document).ready( function() {
    app.initialized()
        .then(function(_client) {
            window.client = _client;
            client.events.on("app.activated",
                function() {
                    //Your code here
                });
        });
});

function openModal() {
    client.interface.trigger('showModal', {title: 'Add Integration Action', template: 'modal.html'});
}

function closePopup() {
    client.instance.close();
}
