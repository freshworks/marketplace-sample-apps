!(function() {
    var clientAPP = null;
    initAPP = function(_client) {
        clientAPP = _client;
        clientAPP.events.on('app.activated', initHandlers);
    };

    /**
     * A function to open the modal to display ticket and it's associated data.
     */
    initDemoApp = function() {
        clientAPP.interface.trigger('showModal', { title: 'Ticket and Associated Details', template: 'content.html' })
            .then(
                function(data) {
                    console.log("App Loaded");
                },
                function(error) {
                    console.log(error);
                }
            );
    };
    initHandlers = function() {
        document.addEventListener('click', function(event) {
            event.preventDefault();
            if (event.target.id === 'startDemo') {
                initDemoApp();
            }
        })
    };
    document.addEventListener('DOMContentLoaded', function(event) {
        app.initialized().then(initAPP);
    })
});