function showNotification(type, message) {
    client.interface.trigger("showNotify", {
        type: type,
        message: message
    }).catch(function (error) {
        console.error('failed to show notification');
        console.error(error);
    });
}

function createTicket() {
    const properties = {
        email: 'sample@sample.com',
        subject: 'sample ticket',
        description: 'This is a test ticket created from a demo',
        priority: 1,
        status: 2
    };
    client.request.invoke('createTicket', properties).then(function (data) {
        console.info('Ticket create successfull');
        console.info(JSON.stringify(data));
        showNotification('success', `Ticket created successfully! Ticket ID: ${data.response.data.id}`);
    }).catch(function (error) {
        console.error('Ticket create error');
        console.error(JSON.stringify(error));
        showNotification('danger', 'Failed to create ticket.');
    });
}

function updateTicket() {
    const properties = {
        ticketId: 12,
        priority: 2
    };
    client.request.invoke('updateTicket', properties).then(function (data) {
        console.info('Ticket update successfull');
        console.info(JSON.stringify(data));
        showNotification('success', 'Ticket updated successfully!');
    }).catch(function (error) {
        console.error('Ticket update error');
        console.error(JSON.stringify(error));
        showNotification('danger', 'Failed to update ticket.');
    });
}

function getTicket() {
    const ticketId = 12;
    client.request.invoke('getTicket', { ticketId }).then(function (data) {
        console.info('Ticket fetch successfull');
        console.info(JSON.stringify(data));
        showNotification('success', `Ticket got successfully! Ticket ID: ${ticketId} and Priority: ${data.response.data.priority}`);
    }).catch(function (error) {
        console.error('Ticket fetch error');
        console.error(JSON.stringify(error));
        showNotification('danger', 'Failed to get ticket.');
    });
}

function deleteTicket() {
    const ticketId = 12;
    client.request.invoke('deleteTicket', { ticketId }).then(function (data) {
        console.info('Ticket delete successfull');
        console.info(JSON.stringify(data));
        showNotification('success', 'Ticket deleted successfully!');
    }).catch(function (error) {
        console.error('Ticket delete error');
        console.error(JSON.stringify(error));
        showNotification('danger', 'Failed to delete ticket.');
    });
}

function searchContact() {
    client.request.invoke('searchContact', { query: document.getElementById('contactEmail').value }).then(function (data) {
        console.info('Contact search successfull');
        console.info(JSON.stringify(data));
        showNotification('success', `Contact search successful! Search results: ${data.response.data.total}`);
    }).catch(function (error) {
        console.error('Contact contact error');
        console.error(JSON.stringify(error));
        showNotification('danger', 'Failed to search contact.');
    });
}

function onDocumentReady() {
    app.initialized()
        .then(function (_client) {
            window.client = _client;
            client.events.on('app.activated',
                function () {

                });
        });
}

document.addEventListener("DOMContentLoaded", onDocumentReady);
