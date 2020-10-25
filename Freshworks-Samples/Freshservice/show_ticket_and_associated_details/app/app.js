var clientAPP = null;
let initAPP = function(_client) {
    clientAPP = _client;
    clientAPP.events.on('app.activated', initHandlers);
};

/**
 * A function to open the modal to display ticket and it's associated data.
 */
let initDemoApp = function() {
    clientAPP.interface.trigger('showModal', { title: 'Ticket and Associated Details', template: 'content.html' })
        .then(
            function() {
                console.log("App Loaded");
            },
            function(error) {
                console.log(error);
            }
        );
};
let initHandlers = function() {
    document.getElementById("startDemo").addEventListener("click", initDemoApp);
};

(function() {
    app.initialized().then(initAPP);
})();