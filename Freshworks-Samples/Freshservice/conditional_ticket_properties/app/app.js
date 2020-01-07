!(function($) {
    var clientAPP = null,
        requiredGroupId = 14, //HR Group
        requiredPriorityName = "High";
    initAPP = function(_client) {
        clientAPP = _client;
        clientAPP.events.on('app.activated', function() {
            clientAPP.events.on('ticket.propertiesLoaded', function() {
                initHandlers();
            });
        });
    };

    disableAndAddNote = function() {
        clientAPP.interface.trigger("hideElement", { id: "dueDateEdit" });//hides the due by change button
        clientAPP.interface.trigger("disableElement", { id: "group" });//disable the group field of ticket properies
        clientAPP.interface.trigger("disableElement", { id: "impact" });//disable the impact field of ticket properies
        clientAPP.interface.trigger("disableElement", { id: "type" })//disable the type field of ticket properies
        clientAPP.interface.trigger("click", { id: "openNote", text: "Ticket is of High Priority. Your action is required." })//open the add note form with pre-filled content.
    };

    initHandlers = function() {
        clientAPP.interface.trigger("hideElement", { id: "type" })
        clientAPP.data.get("loggedInUser").then(
            function(data) {
                if ($.inArray(requiredGroupId, data.loggedInUser.group_ids) > -1) {
                    clientAPP.interface.trigger("hideElement", { id: "urgency" });//hides the urgency field of ticket properties
                    clientAPP.interface.trigger("hideElement", { id: "impact" });//hides the impact field of ticket properties
                }
            },
            function(error) {
                console.log("Error");
            }
        );
        clientAPP.data.get("ticket").then(
            function(data) {
                if (data.ticket.priority_name == requiredPriorityName)
                    disableAndAddNote();
            },
            function(error) {
                console.log("Error");
            }
        );
        clientAPP.events.on("ticket.propertiesUpdated", function(event) {
            var event_data = event.helper.getData();
            if (event_data.priority)
                if (event_data.priority.name == requiredPriorityName)
                    disableAndAddNote();
        });
    };

    $(document).ready(function() {
        app.initialized().then(initAPP);
    });

})(window.jQuery);