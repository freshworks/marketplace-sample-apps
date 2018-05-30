!(function($) {
    var clientAPP = null,
        successMessage = "All ticket properties have now been updated",
        requiredStatus = "5"; //Close Status Value
    initAPP = function(_client) {
        clientAPP = _client;
        clientAPP.events.on('app.activated', initHandlers);
    };

    closeTicketConfirmation = function() {
        clientAPP.interface.trigger("showConfirm", { title: "Confirm", message: "Are you sure you want to close this ticket?" })//Open the confirm box with pre-filled content
    };

    initHandlers = function() {
        clientAPP.events.on("ticket.propertiesUpdated", function() {
            client.interface.trigger("showNotify", { type: "success", message: successMessage });//displays the flash notice at the top
        });

        clientAPP.events.on("ticket.closeTicketClick", closeTicketConfirmation);//triggered when the close button is clicked on the top nav bar
        clientAPP.events.on("ticket.statusChanged", function(event) {
            var event_data = event.helper.getData();
            if (event_data.new == requiredStatus)
                closeTicketConfirmation();
        });

        $("#showChildTicketData").on("click", function() {
            clientAPP.interface.trigger('showModal', { title: 'Child Ticket Details', template: 'content.html' })
                .then(
                    function(data) {
                        console.log("App Loaded");
                    },
                    function(error) {
                        console.log(error);
                    }
                );
        });//opens the modal which will display the child ticket data
    };

    $(document).ready(function() {
        app.initialized().then(initAPP);
    });

})(window.jQuery);