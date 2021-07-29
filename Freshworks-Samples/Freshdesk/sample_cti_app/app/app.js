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
    document.getElementById('dialpad').style.display = 'none';
    document.getElementById('contacts').style.display = 'none';
}

/**
 * Opens up the call in-progress screen
 **/
function showOnCallScreen() {
    hideMainScreen();
    document.getElementById('onCallScreen').style.display = 'block';
    document.getElementById('btnEndCall').removeEventListener('click', function () { });
    document.getElementById('btnEndCall').addEventListener('click', function () { hangupActiveCallApi(false); });
    document.getElementById('createTicket').removeEventListener('click', function () { });
    if (callTicket) {
        document.getElementById('createTicket').innerText = `Go to ticket: #${callTicket.toString()}`;
        document.getElementById('createTicket').addEventListener('click', function () { navigateToTicket(callTicket); });
    } else {
        document.getElementById('createTicket').addEventListener('click', function () { createTicketWithCallNotes(false); });
    }
}

/**
 * Opens up the call summary screen
 **/
function showCallSummaryScreen() {
    hideMainScreen();
    document.getElementById('onCallScreen').style.display = 'none';
    document.getElementById('callSummaryScreen').style.display = 'block';
    document.getElementById('callNotesOnSummary').value = document.getElementById('callNotes').value;
    document.getElementById('callNotes').value = '';
    document.getElementById('btnCreateTicketWithNotes').removeEventListener('click', function () { });
    document.getElementById('btnCreateTicketWithNotes').addEventListener('click', function () { createTicketWithCallNotes(true); });
    document.getElementById('btnCancel').removeEventListener('click', endIncompleteCall);
    document.getElementById('btnCancel').addEventListener('click', endIncompleteCall);
}

/**
 * Adds dialer events
 **/
function dialpadEvents() {
    var count = 0;
    const digits = document.querySelectorAll('.digit');
    digits.forEach(function (digit) {
        digit.removeEventListener('click', function () { });
        digit.addEventListener('click', function () {
            var num = (this.innerText);
            if (count < 15) {
                var prevOutput = document.getElementById('output').value;
                document.getElementById('output').value = (prevOutput + num);
                count++
            }
        });
    });

    document.getElementById('call').removeEventListener('click', function () { });
    document.getElementById('call').addEventListener('click', function () {
        callApi(document.getElementById('output').value);
        document.getElementById('output').value = ('');
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
    document.getElementById('tabContacts').removeEventListener('click', renderContactList);
    document.getElementById('tabContacts').addEventListener('click', renderContactList);
}

function onAppActivated() {
    window.activeCallSid = null;
    window.callTicket = null;
    client.instance.resize({ height: "500px" });
    client.data.get("loggedInUser").then(
        function (data) {
            const phone = data.loggedInUser.contact.phone ? data.loggedInUser.contact.phone : data.loggedInUser.contact.mobile ? data.loggedInUser.contact.mobile : null;
            window.userPhone = phone;
            document.getElementById('mainContent').style.display = 'block';
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
}

document.addEventListener("DOMContentLoaded", onDocumentReady);
