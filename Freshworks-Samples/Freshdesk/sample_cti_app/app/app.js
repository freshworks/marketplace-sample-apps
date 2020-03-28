var middlewareUrl = 'https://<NGROK_GENERATED_SUBDOMAIN>.ngrok.io';

/**
 * Show a notification toast with the given type and message
 *
 * @param {String} type - type of the notification
 * @param {String} message - content to be shown in the notification
 **/
function showNotify(type, message) {
    return client.interface.trigger("showNotify", {
        type: type,
        message: message
    })
}

/**
 * Hides dialer and contact pages
 **/
function hideMainScreen() {
    $('#dialpad').hide();
    $('#contacts').hide();
}

/**
 * Opens up the call in-progress screen
 **/
function showOnCallScreen() {
    hideMainScreen();
    $('#onCallScreen').show();
    $("#btnEndCall").off('click');
    $('#btnEndCall').on('click', false, hangupActiveCallApi);
    $("#createTicket").off('click');
    if (callTicket) {
        $('#createTicket').text(`Go to ticket: #${callTicket.toString()}`);
        $('#createTicket').on('click', callTicket, navigateToTicket);
    } else {
        $('#createTicket').on('click', false, createTicketWithCallNotes);
    }
}

/**
 * Opens up the call summary screen
 **/
function showCallSummaryScreen() {
    hideMainScreen();
    $('#onCallScreen').hide();
    $('#callSummaryScreen').show();
    $('#callNotesOnSummary').val($('#callNotes').val());
    $('#callNotes').val("");
    $("#btnCreateTicketWithNotes").off('click');
    $('#btnCreateTicketWithNotes').on('click', true, createTicketWithCallNotes);
    $('#btnCancel').off('click');
    $('#btnCancel').on('click', endIncompleteCall)
}

/**
 * Adds dialer events
 **/
function dialpadEvents() {
    var count = 0;
    $('.digit').off('click');
    $(".digit").on('click', function () {
        var num = ($(this).text());
        if (count < 15) {
            var prevOutput = $('#output').val();
            $("#output").val(prevOutput + num);
            count++
        }
    });

    $('.fa-long-arrow-left').off('click')
    $('.fa-long-arrow-left').on('click', function () {
        $('#output span:last-child').remove();
        count--;
    });

    $('#call').off('click');
    $('#call').on('click', function () {
        callApi($('#output').val());
        $('#output').val('');
    });
}

/**
 * Adds tab, dialer, and click-to-call events
 **/
function addEventListeners() {
    /* Click-to-call functionality */
    client.events.on("cti.triggerDialer", clickToCallEvent);
    /* Outgoing call functionality */
    dialpadEvents();
    /* Tab click events functionality */
    $("#tabContacts").off('click');
    $("#tabContacts").on('click', renderContactList);
}

function onAppActivated() {
    window.activeCallSid = null;
    window.callTicket = null;
    client.instance.resize({ height: "500px" });
    client.data.get("loggedInUser").then(
        function (data) {
            const phone = data.loggedInUser.contact.phone ? data.loggedInUser.contact.phone : data.loggedInUser.contact.mobile ? data.loggedInUser.contact.mobile : null;
            window.userPhone = phone;
            $("#mainContent").show();
            addEventListeners();
        },
        function (error) {
            console.error('Failed to get logged in user data');
            console.error(error);
            showNotify('danger', 'Failed to get user data. Try again later.');
        }
    );
}

function onDocumentReady() {
    app.initialized()
        .then(function (_client) {
            window.client = _client;
            socketIo();
            client.events.on('app.activated', onAppActivated);
        }).catch(function (error) {
            console.error('The app failed to get initialized');
            console.error(error);
        });
};

$(document).ready(onDocumentReady);
