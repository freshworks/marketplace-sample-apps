var request = require('request');
var util = require('./lib/util');
const PROTOCOL = "https://";
const FS_DOMAIN_SUFFIX = ".freshservice.com";
const FD_DOMAIN_SUFFIX = ".freshdesk.com";
const TICKET_URL = "/api/v2/tickets/";
const FETCH_AGENTS = "/api/v2/agents/";
const CONVERSATIONS = "/conversations";
const NOTES = "/notes";
const TICKET_STATUS_URL = "/api/v2/ticket_fields?type=default_status";
const EVENT_TICKET_CREATE = "onTicketCreate";
const EVENT_TICKET_UPDATE = "onTicketUpdate";
const ADD_PRIVATE_NOTE_IN_FS = "add_private_note_in_fs";
const INFO = "info";
const ERROR = "error";
var returnData = {};

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
    printLog(INFO, "url", url);
    return new Promise((resolve, reject) => {
        $request.get(url, {
                headers: { 'Authorization': util.getFdAPIKey(args) }
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

function createTicket(args, eventType) {
    printLog(INFO, "In new ticket creation");
    var fdBaseURL = PROTOCOL + args.iparams.fd_subdomain + FD_DOMAIN_SUFFIX;
    var fsBaseURL = PROTOCOL + args.iparams.fs_subdomain + FS_DOMAIN_SUFFIX;
    var ruleMap = args.iparams.ruleMap;
    var fsTicketDetails = [];
    if (args.data.ticket.responder_id != null && args.data.ticket.responder_id != "") {
        for (var rule in ruleMap) {
            if (rule.indexOf('rule_') != -1) {
                if (args.data.ticket.status == ruleMap[rule].status &&
                    args.data.ticket.type == ruleMap[rule].type &&
                    args.data.ticket.group_id == ruleMap[rule].group) {
                    var fdAgentURL = fdBaseURL + FETCH_AGENTS + args.data.ticket.responder_id;
                    getRequestApi(fdAgentURL, args, "Agent Data Fetch")
                        .then(agentData => {
                            var agentDetails = [];
                            agentDetails = JSON.parse(agentData.response);
                            var fsAddTktURL = fsBaseURL + TICKET_URL;
                            var headers = {
                                "Authorization": util.getFsAPIKey(args),
                                "ContentType": "application/json",
                                "Accept": "application/json"
                            };
                            var subjectWithFdTktId = `[#FD-${args.data.ticket.id}] ${args.data.ticket.subject}`;
                            var options = {
                                headers: headers,
                                json: {
                                    "status": 2, // default status - open
                                    "priority": 1, // default priority - low
                                    "source": 2, // source - portal
                                    "email": agentDetails.contact.email,
                                    "subject": subjectWithFdTktId,
                                    "description": args.data.ticket.description
                                }
                            };
                            postRequestAPI(fsAddTktURL, options, "Ticket Creation")
                                .then(ticketData => {
                                    printLog(INFO, 'Ticket created successfully');
                                    fsTicketDetails = ticketData.response.ticket;
                                    setDataInDataStore(args.data.ticket.id, { "fsTicketId": fsTicketDetails.id });
                                    if (eventType == EVENT_TICKET_UPDATE) {
                                        if (args.iparams.ruleMap.add_private_note) {
                                            var fdTktGetConvoURL = fdBaseURL + TICKET_URL + args.data.ticket.id + CONVERSATIONS;
                                            getRequestApi(fdTktGetConvoURL, args, "Freshdesk Conversation fetch")
                                                .then(fdConvoData => {
                                                    var fdTktConversations = JSON.parse(fdConvoData.response);
                                                    for (var convo in fdTktConversations) {
                                                        var fsTktAddCovoURL = fsBaseURL + TICKET_URL + fsTicketDetails.id + NOTES;
                                                        var msg = `<div>Note Content: ${fdTktConversations[convo].body}</div>`;
                                                        var fsAddNoteOptions = {
                                                            headers: {
                                                                "Authorization": util.getFsAPIKey(args),
                                                            },
                                                            json: {
                                                                "body": msg
                                                            }
                                                        };
                                                        postRequestAPI(fsTktAddCovoURL, fsAddNoteOptions, "Note Creation")
                                                            .then(fsConvoData => {
                                                                printLog(INFO, 'Conversation created successfully', fsConvoData);
                                                            })
                                                            .catch(function(e) {
                                                                printLog(ERROR, 'Error in conversation create', e);
                                                            });
                                                    }
                                                })
                                                .catch(function(e) {
                                                    printLog(ERROR, 'Error in conversation fetch', e);
                                                });
                                        }
                                    }
                                })
                                .catch(function(e) {
                                    printLog(ERROR, 'Error in create ticket', e);
                                });
                        })
                        .catch(function(e) {
                            printLog(ERROR, 'Error in fetching agent data', e);
                        });
                }
            }
        }
    }
}

function setDataInDataStore(key, value) {
    $db.set(key, value)
        .then(
            function(dbSuccessData) {
                printLog(INFO, "Data saved successfully in data store", JSON.stringify(dbSuccessData));
            },
            function(dbError) {
                printLog(ERROR, "Error in saving data in data store", JSON.stringify(dbError));
            }
        );
}

function getDataFromDataStore(key) {
    return new Promise((resolve) => {
        $db.get(key)
            .then(
                function(dbSuccessData) {
                    returnData['status'] = 'success';
                    returnData['data'] = dbSuccessData;
                    resolve(returnData);
                },
                function(dbError) {
                    returnData['status'] = 'failure';
                    returnData['data'] = dbError;
                    resolve(returnData);
                }
            );
    });
}

exports = {
    events: [
        { event: 'onTicketUpdate', callback: 'onTicketUpdateCallback' },
        { event: 'onTicketCreate', callback: 'onTicketCreateCallback' },
        { event: "onConversationCreate", callback: "onConversationCreateCallback" }
    ],
    onTicketUpdateCallback: function(args) {
        var fdBaseURL = PROTOCOL + args.iparams.fd_subdomain + FD_DOMAIN_SUFFIX;
        var fsBaseURL = PROTOCOL + args.iparams.fs_subdomain + FS_DOMAIN_SUFFIX;
        getDataFromDataStore(args.data.ticket.id)
            .then(dbResponse => {
                if (dbResponse.status == "success") {
                    printLog(INFO, "FS Ticket is already created for this FD Ticket", JSON.stringify(dbResponse.data));
                    if (args.data.ticket.changes.status) {
                        var fsTktId = dbResponse.data["fsTicketId"];
                        if (args.iparams.fd_status_updated == ADD_PRIVATE_NOTE_IN_FS) {
                            var fdGetTktStatusFieldURL = fdBaseURL + TICKET_STATUS_URL;
                            getRequestApi(fdGetTktStatusFieldURL, args, "Freshdesk status details fetch")
                                .then(fdTktStatusData => {
                                    var statusDetails = JSON.parse(fdTktStatusData.response);
                                    var statusChoices = statusDetails[0]["choices"];
                                    var oldStatus = statusChoices[args.data.ticket.changes.status[0]][0];
                                    var newStatus = statusChoices[args.data.ticket.changes.status[1]][0];
                                    var msg = `<div>Note Content: <div>Status has been updated from ${oldStatus} to ${newStatus}</div></div>`;
                                    printLog(INFO, "Note", msg);
                                    var fsTktAddPvtNoteURL = fsBaseURL + TICKET_URL + fsTktId + '/notes';
                                    var fsAddNoteOptions = {
                                        headers: {
                                            "Authorization": util.getFsAPIKey(args),
                                        },
                                        json: {
                                            "body": msg
                                        }
                                    };
                                    postRequestAPI(fsTktAddPvtNoteURL, fsAddNoteOptions, "Note Creation")
                                        .then(noteData => {
                                            printLog(INFO, 'Private Note created successfully', noteData);
                                        })
                                        .catch(function(e) {
                                            printLog(ERROR, 'Error in conversation create', e);
                                        });
                                })
                                .catch(function(e) {
                                    printLog(ERROR, 'Error in FD status details fetch', JSON.stringify(e));
                                });
                        } else {
                            printLog(INFO, "Do nothing in Freshservice on status change in Freshdesk");
                        }
                    }
                } else {
                    createTicket(args, EVENT_TICKET_UPDATE);
                }
            })
            .catch(e => {
                printLog(ERROR, 'Error in fetching data from data store', JSON.stringify(e));
            });
    },

    onTicketCreateCallback: function(args) {
        getDataFromDataStore(args.data.ticket.id)
            .then(dbResponse => {
                if (dbResponse.status == "success") {
                    printLog(INFO, "FS Ticket is already created for this FD Ticket", JSON.stringify(dbResponse.data));
                } else {
                    createTicket(args, EVENT_TICKET_CREATE);
                }
            })
            .catch(e => {
                printLog(ERROR, 'Error in fetching data from data store', JSON.stringify(e));
            });
    },

    onConversationCreateCallback: function(args) {
        if (args.iparams.fd_note_added == ADD_PRIVATE_NOTE_IN_FS &&
            !args.data.conversation.body.startsWith("<div>Note Content: ")) {
            var fsBaseURL = PROTOCOL + args.iparams.fs_subdomain + FS_DOMAIN_SUFFIX;
            var ticketId = args.data.conversation.ticket_id;
            getDataFromDataStore(ticketId)
                .then(dbResponse => {
                    if (dbResponse.status == "success") {
                        var fsTktId = dbResponse.data["fsTicketId"];
                        var fsTktAddCovoURL = fsBaseURL + TICKET_URL + fsTktId + '/notes';
                        var msg = `<div>Note Content: ${args.data.conversation.body}</div>`;
                        printLog(INFO, "Note", msg);
                        var fsAddNoteOptions = {
                            headers: {
                                "Authorization": util.getFsAPIKey(args),
                            },
                            json: {
                                "body": msg
                            }
                        };
                        postRequestAPI(fsTktAddCovoURL, fsAddNoteOptions, "Note Creation")
                            .then(noteData => {
                                printLog(INFO, 'Private Note created successfully', noteData);
                            })
                            .catch(function(e) {
                                printLog(ERROR, 'Error in conversation Creation', JSON.stringify(e));
                            });
                    } else {
                        printLog(ERROR, "This ticket is not present in FS", JSON.stringify(dbResponse));
                    }
                })
                .catch(e => {
                    printLog(ERROR, 'Error in fetching data from data store', JSON.stringify(e));
                });
        } else {
            printLog(INFO, "Do nothing in Freshservice on note creation in Freshdesk");
        }
    }

};