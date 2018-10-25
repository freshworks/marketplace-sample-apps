var util = require('./lib/util');
const INFO = "info";
const ERROR = "error";
const ADD_PRIVATE_NOTE_IN_FD = "add_private_note_in_fd";
const NOTE_PREFIX = "<div>Note Content: ";
const PROTOCOL = "https://";
const FS_DOMAIN_SUFFIX = ".freshservice.com";
const FD_DOMAIN_SUFFIX = ".freshdesk.com";
const TICKET_URL = "/api/v2/tickets/";
const TICKET_STATUS_URL = "/api/v2/ticket_fields?type=default_status";
const NOTES = "/notes";

function printLog(type, msg, data) {
    if (type == INFO) {
        if (data != undefined) {
            console.info("Info : " + msg + " - " + data);
        } else {
            console.info("Info : " + msg);
        }
    } else if (type == ERROR) {
        console.error("Error : " + msg + " - " + data);
    }
}

function postRequestAPI(url, options, operation) {
    return new Promise((resolve, reject) => {
        $request.post(url, options)
            .then(
                function(data) {
                    resolve(data);
                },
                function(e) {
                    printLog(ERROR, operation, JSON.stringify(e));
                    reject(e);
                }
            );
    });
}

function getRequestApi(url, args, operation) {
    return new Promise((resolve, reject) => {
        $request.get(url, {
                headers: { 'Authorization': util.getFsAPIKey(args) }
            })
            .then(
                function(data) {
                    resolve(data);
                },
                function(e) {
                    printLog(ERROR, operation, JSON.stringify(e));
                    reject(e);
                }
            );
    });
}

exports = {
    events: [
        { event: 'onTicketUpdate', callback: 'onTicketUpdateCallback' },
        { event: "onConversationCreate", callback: "onConversationCreateCallback" }
    ],

    onTicketUpdateCallback: function(args) {
        printLog(INFO, "onTicketUpdateCallback");
        var tktSubject = args.data.ticket.subject;
        var regexStr = /^([[]{1}[#]{1}[F]{1}[D]{1}[-]{1}[0-9]+[\]]{1})/;
        var regex = new RegExp(regexStr);
        if (regex.test(tktSubject)) {
            var resultStr = tktSubject.match(regex)[1];
            var lastIndex = resultStr.lastIndexOf('-');
            var fdTktId = resultStr.substring(lastIndex + 1, resultStr.length - 1);
            printLog(INFO, "Freshdesk Ticket Id", fdTktId);
            printLog(INFO, "Is status changed", JSON.stringify(args.data.ticket.changes.status));
            if (args.data.ticket.changes.status) {
                var fdBaseURL = PROTOCOL + args.iparams.fd_subdomain + FD_DOMAIN_SUFFIX;
                var fsBaseURL = PROTOCOL + args.iparams.fs_subdomain + FS_DOMAIN_SUFFIX;
                if (args.iparams.fs_status_updated == ADD_PRIVATE_NOTE_IN_FD) {
                    var fsGetTktStatusFieldURL = fsBaseURL + TICKET_STATUS_URL;
                    getRequestApi(fsGetTktStatusFieldURL, args, 'Freshservice status details fetch')
                        .then(fsTktStatusData => {
                            var statusDetails = JSON.parse(fsTktStatusData.response).ticket_fields[0];
                            var statusChoices = statusDetails.choices;
                            printLog(INFO, "Old Status", statusChoices[args.data.ticket.changes.status[0]][0]);
                            printLog(INFO, "New Status", statusChoices[args.data.ticket.changes.status[1]][0]);
                            var oldStatus = statusChoices[args.data.ticket.changes.status[0]][0];
                            var newStatus = statusChoices[args.data.ticket.changes.status[1]][0];
                            var msg = `<div>Note Content: <div>Status has been updated from ${oldStatus} to ${newStatus}</div></div>`;
                            printLog(INFO, "Msg", msg);
                            var fdTktAddPvtNoteURL = fdBaseURL + TICKET_URL + fdTktId + NOTES;
                            var fdAddNoteOptions = {
                                headers: {
                                    "Authorization": util.getFdAPIKey(args),
                                    "ContentType": "application/json",
                                },
                                json: {
                                    "body": msg
                                }
                            };
                            postRequestAPI(fdTktAddPvtNoteURL, fdAddNoteOptions, "Note Creation").then(noteData => {
                                    printLog(INFO, 'Private Note created successfully', noteData);
                                })
                                .catch(e => {
                                    printLog(ERROR, 'Error in conversation create', e);
                                });
                        })
                        .catch(e => {
                            printLog(ERROR, 'Error in FS status details fetch', e);
                        });
                } else {
                    printLog(INFO, "Do nothing in Freshdesk on status change in Freshservice");
                }
            }
        }
    },

    onConversationCreateCallback: function(args) {
        printLog(INFO, "onConversationCreateCallback");
        if (args.iparams.fs_note_added == ADD_PRIVATE_NOTE_IN_FD &&
            !args.data.conversation.body.startsWith(NOTE_PREFIX)) {
            var fsBaseURL = PROTOCOL + args.iparams.fs_subdomain + FS_DOMAIN_SUFFIX;
            var fdBaseURL = PROTOCOL + args.iparams.fd_subdomain + FD_DOMAIN_SUFFIX;
            var ticketId = args.data.conversation.ticket_id;
            var getFsTktURL = fsBaseURL + TICKET_URL + ticketId;
            getRequestApi(getFsTktURL, args, "Fetch FS Ticket details")
                .then(fsTktData => {
                    var fsTktDetails = fsTktData.response;
                    var tktSubject = JSON.parse(fsTktDetails).ticket.subject;
                    var regexStr = /^([[]{1}[#]{1}[F]{1}[D]{1}[-]{1}[0-9]+[\]]{1})/;
                    var regex = new RegExp(regexStr);
                    if (regex.test(tktSubject)) {
                        var resultStr = tktSubject.match(regex)[1];
                        var lastIndex = resultStr.lastIndexOf('-');
                        var fdTktId = resultStr.substring(lastIndex + 1, resultStr.length - 1);
                        var fdTktAddPvtNoteURL = fdBaseURL + TICKET_URL + fdTktId + NOTES;
                        var msg = `<div>Note Content: ${args.data.conversation.body}</div>`;
                        var fdAddNoteOptions = {
                            headers: {
                                "Authorization": util.getFdAPIKey(args),
                                "ContentType": "application/json",
                            },
                            json: {
                                "body": msg
                            }
                        };
                        postRequestAPI(fdTktAddPvtNoteURL, fdAddNoteOptions, 'Note Creation')
                            .then(noteData => {
                                printLog(INFO, 'Private Note created successfully in Freshdesk', noteData);
                            })
                            .catch(e => {
                                printLog(ERROR, 'Error in conversation create', e);
                            });
                    }
                })
                .catch(e => {
                    printLog(ERROR, "Error while fetching Freshservice Ticket", e);
                });

        } else {
            printLog(INFO, "Do nothing in Freshdesk when note is added in Freshservice");
        }
    }

};