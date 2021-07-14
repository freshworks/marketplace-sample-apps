"use strict";

/**
 * @desc - This app intercepts the ticket close event and checks if there is
 * any timer running. If so, it rejects the close action and displays an
 * error message.
 */

document.addEventListener("DOMContentLoaded", appInitialized);

function appInitialized() {
    app.initialized().then(client => {
        window.client = client;
        client.events.on("app.activated", appActivated);
    });
}

function appActivated() {
    client.events.on("ticket.closeTicketClick", timerValidation, {
        intercept: true
    });
    client.events.on("ticket.propertiesUpdated", propertiesUpdatedCallback, {
        intercept: true
    });
}

function propertiesUpdatedCallback(event) {
    // Use event.helper.getData() to get the event details.
    const data = event.helper.getData(); //Sample data: { changedAttributes: { status: { old:1, new:2 } } }
    // status changed to closed

    if (data.changedAttributes.status && data.changedAttributes.status[1] === 5) {
        timerValidation(event);
    } else {
        event.helper.done();
    }
}

// Function executed when the ticked is getting closed.
function timerValidation(event) {
    client.data.get("ticket").then(ticketData => ticketDataRequest(ticketData, event),
        e => handleErrors(e, event)
    );
};

function ticketDataRequest(ticketData, event) {
    client.iparams.get("freshdesk_domain").then(function (iparam) {
        const { url, options } = requestSettings(ticketData, iparam)
        console.log(url, options)
        client.request.get(url, options).then(
            data => timerDataRequestHandler(data, event),
            e => handleErrors(e, event)
        )
    }, function (error) {
        console.error("Something went wrong!");
        console.error(error);
    })
}

function requestSettings(ticketData, iparam) {
    const baseUrl = `https://${iparam.freshdesk_domain}.freshdesk.com/api/v2/tickets/`;
    return {
        url: `${baseUrl}${ticketData.ticket.id}/time_entries`,
        options: {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Basic <%= encode(iparam.freshdesk_key + ':x') %>"
            }
        }
    }
}

function timerDataRequestHandler(data, event) {
    if (data.status === 200) {
        const runningTimer = JSON.parse(data.response).some(timeEntry => timeEntry.timer_running === true);
        const failText = "Timer(s) running. Stop the timer(s) before proceeding to close the ticket."

        runningTimer ?
            event.helper.fail(failText) :
            event.helper.done()

    } else {
        handleErrors(data, event);
    }
}

function handleErrors(e, event) {
    event.helper.fail(
        `Some Error occured in validating ticket close. Status: ${e.status} ${e.message}`
    );
}
