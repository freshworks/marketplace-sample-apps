/**
 * @desc - This app demonstrates the usage of modals and Instance APIs
 * 1 - Using data API to get the ticket requester's details.
 * 2 - Using interface API to open up a modal and pass data to the modal.
 *
 */

$(document).ready(function () {
    app.initialized().then(function (_client) {
        var client = _client;
        client.events.on('app.activated', fireModal);

        function fireModal() {
            client.data.get('contact').then(function (data) {
                $('#send-details').click(function () {
                    /**
                     * @fires - Interface API to show Modal and insert modal.html
                     * Also, Data API to get requester's details
                     *            */
                    client.interface.trigger("showModal", {
                        title: "Contact Form",
                        template: "modal.html",
                        data: {
                            name: data.contact.name,
                            email: data.contact.email
                        }
                    });
                });
            });
        }
    });
});
