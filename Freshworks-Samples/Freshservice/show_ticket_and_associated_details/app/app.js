!(function($) {
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
        $(document).on("click", "#startDemo", initDemoApp);
    };
    $(document).ready(function() {
        app.initialized().then(initAPP);
    });
})(window.jQuery);