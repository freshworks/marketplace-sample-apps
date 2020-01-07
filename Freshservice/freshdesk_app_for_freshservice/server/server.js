var util = require('./lib/util');

var urlConstants = {
    protocol : "https://",
    fs_domain_suffix : ".freshservice.com",
    fd_domain_suffix : ".freshdesk.com",
    ticket_url : "/api/v2/tickets/",
    ticket_status_url : "/api/v2/ticket_fields?type=default_status",
    notes : "/notes"
};
var dataConstants = {
    info : "info",
    error : "error",
    add_private_note_in_fd : "add_private_note_in_fd",
    note_prefix : "<div>Note Content: "
};

function printLog(type, msg, data) {
    if (type == dataConstants.info) {
        if (data != undefined) {
            console.info("Info : " + msg + " - " + data);
        } else {
            console.info("Info : " + msg);
        }
    } else if (type == dataConstants.error) {
        console.error("Error : " + msg + " - " + data);
    }
}

function postRequestAPI(url, options, operation) {
    printLog(dataConstants.info, "Post url", url);
    return new Promise((resolve, reject) => {
        $request.post(url, options)
            .then(
                function(data) {
                    resolve(data);
                },
                function(e) {
                    printLog(dataConstants.error, operation, JSON.stringify(e));
                    reject(e);
                }
            );
    });
}

function getRequestApi(url, args, operation) {
    printLog(dataConstants.info, "Get url", url);
    return new Promise((resolve, reject) => {
        $request.get(url, {
                headers: { 'Authorization': util.getFsAPIKey(args) }
            })
            .then(
                function(data) {
                    resolve(data);
                },
                function(e) {
                    printLog(dataConstants.error, operation, JSON.stringify(e));
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
        printLog(dataConstants.info, "onTicketUpdateCallback");
        var tktSubject = args.data.ticket.subject;
        var regexStr = /^([[]{1}[#]{1}[F]{1}[D]{1}[-]{1}[0-9]+[\]]{1})/;
        var regex = new RegExp(regexStr);
        printLog(dataConstants.info, "FS tkt created from FD", regex.test(tktSubject));
        if (regex.test(tktSubject)) {
            var resultStr = tktSubject.match(regex)[1];
            var lastIndex = resultStr.lastIndexOf('-');
            var fdTktId = resultStr.substring(lastIndex + 1, resultStr.length - 1);
            printLog(dataConstants.info, "Freshdesk Ticket Id", fdTktId);
            printLog(dataConstants.info, "Is status changed", JSON.stringify(args.data.ticket.changes.status));
            if (args.data.ticket.changes.status) {
                var fdBaseURL = urlConstants.protocol + args.iparams.fd_subdomain + urlConstants.fd_domain_suffix;
                var fsBaseURL = urlConstants.protocol + args.iparams.fs_subdomain + urlConstants.fs_domain_suffix;

                printLog(dataConstants.info, "On status change in FS", args.iparams.fs_status_updated);
                if (args.iparams.fs_status_updated == dataConstants.add_private_note_in_fd) {
                    var fsGetTktStatusFieldURL = fsBaseURL + urlConstants.ticket_status_url;
                    getRequestApi(fsGetTktStatusFieldURL, args, 'Freshservice status details fetch')
                        .then(fsTktStatusData => {
                            var statusDetails = JSON.parse(fsTktStatusData.response).ticket_fields[0];
                            var statusChoices = statusDetails.choices;
                            printLog(dataConstants.info, "Old Status", statusChoices[args.data.ticket.changes.status[0]][0]);
                            printLog(dataConstants.info, "New Status", statusChoices[args.data.ticket.changes.status[1]][0]);
                            var oldStatus = statusChoices[args.data.ticket.changes.status[0]][0];
                            var newStatus = statusChoices[args.data.ticket.changes.status[1]][0];
                            var msg = `<div>Note Content: <div>Status has been updated from ${oldStatus} to ${newStatus}</div></div>`;
                            printLog(dataConstants.info, "Msg", msg);
                            var fdTktAddPvtNoteURL = fdBaseURL + urlConstants.ticket_url + fdTktId + urlConstants.notes;
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
                                    printLog(dataConstants.info, 'Private Note created successfully', noteData);
                                })
                                .catch(e => {
                                    printLog(dataConstants.error, 'Error in conversation create', e);
                                });
                        })
                        .catch(e => {
                            printLog(dataConstants.error, 'Error in FS status details fetch', e);
                        });
                } else {
                    printLog(dataConstants.info, "Do nothing in Freshdesk on status change in Freshservice");
                }
            }
        }
    },

    onConversationCreateCallback: function(args) {
        printLog(dataConstants.info, "onConversationCreateCallback", args.iparams.fs_note_added);
        if (args.iparams.fs_note_added == dataConstants.add_private_note_in_fd &&
            !args.data.conversation.body.startsWith(dataConstants.note_prefix)) {

            printLog(dataConstants.info, "Create Note in FD");
            var fsBaseURL = urlConstants.protocol + args.iparams.fs_subdomain + urlConstants.fs_domain_suffix;
            var fdBaseURL = urlConstants.protocol + args.iparams.fd_subdomain + urlConstants.fd_domain_suffix;
            var ticketId = args.data.conversation.ticket_id;
            var getFsTktURL = fsBaseURL + urlConstants.ticket_url + ticketId;
            getRequestApi(getFsTktURL, args, "Fetch FS Ticket details")
                .then(fsTktData => {
                    printLog(dataConstants.info, "Freshservice Ticket fetched successfully");
                    var fsTktDetails = fsTktData.response;
                    var tktSubject = JSON.parse(fsTktDetails).ticket.subject;
                    var regexStr = /^([[]{1}[#]{1}[F]{1}[D]{1}[-]{1}[0-9]+[\]]{1})/;
                    var regex = new RegExp(regexStr);
                    printLog(dataConstants.info, "FS tkt created from FD", regex.test(tktSubject));
                    if (regex.test(tktSubject)) {
                        var resultStr = tktSubject.match(regex)[1];
                        var lastIndex = resultStr.lastIndexOf('-');
                        var fdTktId = resultStr.substring(lastIndex + 1, resultStr.length - 1);
                        var fdTktAddPvtNoteURL = fdBaseURL + urlConstants.ticket_url + fdTktId + urlConstants.notes;
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
                                printLog(dataConstants.info, 'Private Note created successfully in Freshdesk', noteData);
                            })
                            .catch(e => {
                                printLog(dataConstants.error, 'Error in conversation create', e);
                            });
                    }
                })
                .catch(e => {
                    printLog(dataConstants.error, "Error while fetching Freshservice Ticket", e);
                });

        } else {
            printLog(dataConstants.info, "Do nothing in Freshdesk when note is added in Freshservice");
        }
    }

};