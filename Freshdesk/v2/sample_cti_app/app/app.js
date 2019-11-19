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

function showSpinner() {
    $("#spinner").show();
    $("#mainContent").hide();
}

function hideSpinner() {
    $("#spinner").hide();
    $("#mainContent").show();
}

function callNumber(phone_number) {
    hideSpinner();
    $('#output').val(phone_number)
};

/**
 * Open up the CTI placeholder in Freshdesk
 **/
function showCTIApp() {
    client.interface.trigger("show", { id: "softphone" })
        .then(function (data) {
            console.info('opening CTI placeholder');
            var data = event.helper.getData();
            callNumber(data.number);
            console.info('phone number filled in the dialer');
        }).catch(function (error) {
            console.error('failed to open CTI placeholder');
            console.error(error);
        });
};

/**
 * Close the CTI placeholder in Freshdesk
 **/
function hideCTIApp() {
    client.interface.trigger("hide", { id: "softphone" })
        .then(function (data) {
            console.info('closing CTI placeholder');
            var data = event.helper.getData();
            callNumber(data.number);
            console.info('phone number filled in the dialer');
        }).catch(function (error) {
            console.error('failed to close CTI placeholder');
            console.error(error);
        });
};

function clickToCallEvent(event) {
    showApp(event);
};

function openCreateTicketModal() {
    client.interface.trigger("showModal", {
        title: "Create Ticket Modal",
        template: "create_ticket_modal.html",
        data: { callNotes: $('#callNotes').val() }
    }).catch(function (error) {
        console.error('unable to open create ticket modal');
        console.error(error)
        showNotify('danger', 'Unable to open popup to create a ticket. Try again later.')
    });
}

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
    $('#btnEndCall').on('click', hangupActiveCallApi);
    $('#createTicket').on('click', openCreateTicketModal);
}

/**
 * To create a ticket with call notes for the call
 **/
function createTicketWithCallNotes() {
    const ticketDetails = {
        email: 'sample@samplemail.com',
        subject: 'Call with Sampleton',
        priority: 1,
        description: $('#callNotesOnSummary').val(),
    }
    client.data.get("domainName").then(
        function (data) {
            client.request.post(data.domainName + "/api/v2/tickets",
                {
                    headers: {
                        Authorization: '<%= encode(iparam.freshdesk_api_key) %>'
                    },
                    json: ticketDetails,
                    method: "POST"
                }).then(() => {
                    console.info('Successfully created ticket in Freshdesk');
                    $('#callSummaryScreen').hide();
                    $('#dialpad').show();
                }, error => {
                    console.error('Error: Failed to create a ticket in Freshdesk');
                    console.error(error)
                    showNotify('danger', 'failed to create a ticket. Try again later.');
                })
        },
        function (error) {
            console.error('Error: Failed to create a ticket');
            console.error(error);
            showNotify('danger', 'failed to create a ticket. Try again later.');
        });
}

/**
 * Opens up the call summary screen
 **/
function showCallSummaryScreen() {
    $('#onCallScreen').hide();
    $('#callSummaryScreen').show();
    $('#callNotesOnSummary').val($('#callNotes').val());
    $('#callNotes').val("");
    $("#btnCreateTicketWithNotes").off('click');
    $('#btnCreateTicketWithNotes').on('click', createTicketWithCallNotes);
}

function endIncompleteCall() {
    $('#callNotes').val("");
    activeCallSid = null;
    $('#onCallScreen').hide();
    $('#dialpad').show();
}

/**
 * Makes an API to Twilio to begin the call with the given phone number
 *
 * @param {String} phoneNumber - phone number to make call with
 **/
function callApi(phoneNumber) {
    var headers = {
        "Authorization": "Basic <%= encode(iparam.twilio_sid + ':' + iparam.twilio_auth_token) %>",
        'content-type': 'application/json'
    };
    var options = {
        headers: headers,
        json: {
            Url: "http://demo.twilio.com/docs/voice.xml",
            To: phoneNumber,
            From: userPhone,
            statusCallbackEvent: ["initiated", "ringing", "answered", "completed"]
        }
    };
    var url = "https://api.twilio.com/2010-04-01/Accounts/<% iparam.twilio_sid %>/Calls.json";
    client.request.post(url, options)
        .then(
            function (data) {
                activeCallSid = data.sid;
            },
            function (error) {
                console.error('failed to make a call API')
                console.error(error);
                showNotify('danger', 'failed to make a call. Try again later.');
            });
}

function setCallSid(sid) {
    activeCallSid = sid;
}

/**
 * Makes an API to Twilio to hangup the call with the active call SID
 *
 * @param {Boolean} isCallIncomplete - to navigate the call screen based on the call status
 **/
function hangupActiveCallApi(isCallIncomplete) {
    if (isCallIncomplete) {
        endIncompleteCall();
        return;
    }
    if (!activeCallSid) {
        console.error('no call in progress')
    } else {
        var headers = {
            "Authorization": "Basic <%= encode(iparam.twilio_sid + ':' + iparam.twilio_auth_token) %>",
            'content-type': 'application/json'
        };
        var options = {
            headers: headers,
            json: {
                Status: "completed"
            }
        };
        var url = `https://api.twilio.com/2010-04-01/Accounts/<% iparam.twilio_sid %>/Calls/${activeCallSid}.json`;
        client.request.post(url, options).then(
            function () {
                activeCallSid = null;
                showCallSummaryScreen();
            },
            function (error) {
                console.error('failed to make call hangup API');
                console.error(error);
                showNotify('danger', 'failed hangup the call. Try again.');
            });
    }
}

function makeCall(phoneNumber) {
    callApi(phoneNumber);
    showOnCallScreen();
}

function dialpadEvents() {
    var count = 0;
    $('.digit').off('click');
    $(".digit").on('click', function () {
        var num = ($(this).text());
        if (count < 11) {
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
        makeCall($('#output').val());
        $('#output').val('');
    });
}

/**
 * Makes an API to Freshdesk to fetch all the contacts
 **/
function fetchContacts() {
    return new Promise(function (resolve, reject) {
        client.data.get("domainName").then(
            function (domainData) {
                const url = 'https://'.concat(domainData.domainName, '/api/v2/contacts');
                const options = {
                    headers: {
                        Authorization: 'Basic <%= encode(iparam.freshdesk_api_key) %>'
                    }
                }
                client.request.get(url, options).then(function (data) {
                    return resolve(JSON.parse(data.response));
                }, function (error) {
                    console.error(error);
                    return reject(error);
                });
            }, function (error) {
                console.error(error);
                return reject(error);
            });
    });
}

function contactsEvents() {
    $('.contactPhone').off("click")
    $('.contactPhone').on("click", function () {
        const contactPhone = $(this).text();
        makeCall(contactPhone);
    });
}

function renderContactList() {
    fetchContacts().then(function (contacts) {
        var contactNames = contacts.map(function (contact) {
            return contact.name;
        });
        var contactPhones = contacts.map(function (contact) {
            return contact.phone;
        });
        var contactsList = $('#contactsList')
        $.each(contactNames, function (i) {
            var li = $('<li/>')
                .addClass('list-group-item')
                .attr('role', 'menuitem')
                .appendTo(contactsList);
            $('<div/>')
                .text(contactNames[i])
                .appendTo(li);
            $('<div/>')
                .text(contactPhones[i])
                .addClass('contactPhone')
                .appendTo(li);
        });
        contactsEvents();
    }, function (error) {
        console.error('Error: Failed to fetch the contacts list');
        console.error(error);
        showNotify('danger', 'Failed to load the contacts. Try again later.');
    })
}

function addEventListeners() {
    client.events.on("cti.triggerDialer", clickToCallEvent);
    dialpadEvents();
    $("#tabContacts").off('click');
    $("#tabContacts").on('click', renderContactList);
}

function onAppActivated() {
    client.data.get("loggedInUser").then(
        function (data) {
            const phone = data.loggedInUser.contact.phone ? data.loggedInUser.contact.phone : data.loggedInUser.contact.mobile ? data.loggedInUser.contact.mobile : null;
            window.userPhone = phone;
            hideSpinner();
            addEventListeners();
        },
        function (error) {
            console.error('Failed to get logged in user data');
            console.error(error);
            showNotify('danger', 'Failed to get user data. Try again later.');
        }
    );
}

function socketIo() {
    const socket = io('https://2bc9d7cf.ngrok.io');
    socket.on('incoming_call', function (data) {
        showCTIApp();
        setCallSid(data.callInfo.CallSid);
        showOnCallScreen();
    });

    socket.on('handle_call_status_change', function (data) {
        if (data.callInfo.CallStatus === 'completed') {
            console.info('the call has been completed');
            hangupActiveCallApi(false);
        } else if (data.callInfo.CallStatus === 'answered') {
            console.info('the call has been answered');
        } else if (data.callInfo.CallStatus === 'busy') {
            console.info('the call is busy');
            hangupActiveCallApi(true);
        } else if (data.callInfo.CallStatus === 'no-answer') {
            console.info('the call is not answered');
            hangupActiveCallApi(true);
        } else if (data.callInfo.CallStatus === 'failed') {
            console.info('the call is failed to connect');
            hangupActiveCallApi(true);
        } else if (data.callInfo.CallStatus === 'canceled') {
            console.info('the call has been canceled');
            hangupActiveCallApi(true);
        } else {
            console.info('unknown call status:', data.callInfo.CallStatus);
            hangupActiveCallApi(true);
        }
    });

    socket.on('disconnect', () => {
        console.info('socket disconnected');
    });
}

function onDocumentReady() {
    app.initialized()
        .then(function (_client) {
            window.client = _client;
            window.activeCallSid = null;
            client.instance.resize({ height: "500px" });
            socketIo();
            client.events.on('app.activated', onAppActivated);
        }).catch(function (error) {
            console.error('The app failed to get initialized');
            console.error(error);
        });
};

$(document).ready(onDocumentReady);
