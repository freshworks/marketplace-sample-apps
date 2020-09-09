function showNotification(type, message) {
    client.interface.trigger("showNotify", {
        type: type,
        message: message
    }).catch(function (error) {
        console.error('failed to show notification');
        console.error(error);
    });
};

function createTicket() {
    console.log('create ticket clicked')
    const properties = {
        email: 'sample@sample.com',
        subject: 'sample ticket',
        description: 'This is a test ticket created from a demo',
        priority: 1,
        status: 2
    };
    client.request.invoke('createTicket', properties).then(function (data) {
        console.log('Ticket create successfull');
        console.log(JSON.stringify(data));
        console.table(data);
        showNotification('success', `Ticket created successfully! Ticket ID: ${data.response.data.id}`);
    }).catch(function (error) {
        console.log('Ticket create error');
        console.log(JSON.stringify(error));
        showNotification('danger', 'Failed to create ticket.');
    });
};

function updateTicket() {
    console.log('update ticket clicked')
    const properties = {
        ticketId: 12,
        priority: 2
    };
    client.request.invoke('updateTicket', properties).then(function (data) {
        console.log('Ticket update successfull');
        console.log(JSON.stringify(data));
        console.table(data);
        showNotification('success', 'Ticket updated successfully!');
    }).catch(function (error) {
        console.log('Ticket update error');
        console.log(JSON.stringify(error));
        showNotification('danger', 'Failed to update ticket.');
    });
};

function getTicket() {
    console.log('get ticket clicked')
    const ticketId = 12;
    client.request.invoke('getTicket', { ticketId }).then(function (data) {
        console.log('Ticket fetch successfull');
        console.log(JSON.stringify(data));
        console.table(data);
        showNotification('success', `Ticket got successfully! Ticket ID: ${ticketId} and Priority: ${data.response.data.priority}`);
    }).catch(function (error) {
        console.log('Ticket fetch error');
        console.log(JSON.stringify(error));
        showNotification('danger', 'Failed to get ticket.');
    });
};

function deleteTicket() {
    console.log('delete ticket clicked')
    const ticketId = 12;
    client.request.invoke('deleteTicket', { ticketId }).then(function (data) {
        console.log('Ticket delete successfull');
        console.log(JSON.stringify(data));
        console.table(data);
        showNotification('success', 'Ticket deleted successfully!');
    }).catch(function (error) {
        console.log('Ticket delete error');
        console.log(JSON.stringify(error));
        showNotification('danger', 'Failed to delete ticket.');
    });
};

function searchContact() {
    console.log('search contact clicked')
    client.request.invoke('searchContact', { query: $("#contactEmail").val() }).then(function (data) {
        console.log('Contact search successfull');
        console.log(JSON.stringify(data));
        console.table(data);
        showNotification('success', `Contact search successful! Search results: ${data.response.data.total}`);
    }).catch(function (error) {
        console.log('Contact contact error');
        console.log(JSON.stringify(error));
        showNotification('danger', 'Failed to search contact.');
    });
};

function onDocumentReady() {
    app.initialized()
        .then(function (_client) {
            window.client = _client;
            client.events.on('app.activated',
                function () {

                });
        });
};

$(document).ready(onDocumentReady);
