var request = require('request');
var util = require('./lib/util');
var moment = require('moment');

var urlConstants = {
    protocol : "https://",
    fs_domain_suffix : ".freshservice.com",
    fd_domain_suffix : ".freshdesk.com",
    ticket_url : "/api/v2/tickets/",
    fetch_agents : "/api/v2/agents/",
    conversations : "/conversations",
    notes : "/notes",
    ticket_status_url : "/api/v2/ticket_fields?type=default_status",
    fs_requester_url : "/api/v2/requesters?email="
};
var dataConstants = {
    event_ticket_create : "onTicketCreate",
    event_ticket_update : "onTicketUpdate",
    add_private_note_in_fs : "add_private_note_in_fs",
    info : "info",
    error : "error",
    freshdesk : "Freshdesk",
    freshservice : "Freshservice"
};
var returnData = {};

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

function getRequestApi(url, args, operation, product) {
    printLog(dataConstants.info, "Get url", url);
    return new Promise((resolve, reject) => {
        $request.get(url, {
                headers: { 'Authorization': product == dataConstants.freshdesk ? util.getFdAPIKey(args) : util.getFsAPIKey(args) }
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

function createTicket(args, eventType) {
    printLog(dataConstants.info, "In new ticket creation");
    var fdBaseURL = urlConstants.protocol + args.iparams.fd_subdomain + urlConstants.fd_domain_suffix;
    var fsBaseURL = urlConstants.protocol + args.iparams.fs_subdomain + urlConstants.fs_domain_suffix;
    var ruleMap = args.iparams.ruleMap;

    printLog(dataConstants.info, "RuleMap", JSON.stringify(ruleMap));
    printLog(dataConstants.info, "ResponderId", args.data.ticket.responder_id);

    if (args.data.ticket.responder_id != null && args.data.ticket.responder_id != "") {
        for (var rule in ruleMap) {
            printLog(dataConstants.info, "CurrentRule", rule);

            if (rule.indexOf('rule_') != -1) {

                printLog(dataConstants.info, "Args status", args.data.ticket.status);
                printLog(dataConstants.info, "Rule status", ruleMap[rule].status);
                printLog(dataConstants.info, "Args type", args.data.ticket.type);
                printLog(dataConstants.info, "Rule type", ruleMap[rule].type);
                printLog(dataConstants.info, "Args group", args.data.ticket.group_id);
                printLog(dataConstants.info, "Rule group", ruleMap[rule].group);

                if (args.data.ticket.status == ruleMap[rule].status &&
                    args.data.ticket.type == ruleMap[rule].type &&
                    args.data.ticket.group_id == ruleMap[rule].group) {

                    printLog(dataConstants.info, "Found rule match");
                    var fdAgentURL = fdBaseURL + urlConstants.fetch_agents + args.data.ticket.responder_id;
                    var requestersDeptId;
                    getRequestApi(fdAgentURL, args, "Agent Data Fetch", dataConstants.freshdesk)
                        .then(agentData => {
                            var agentDetails = [];
                            agentDetails = JSON.parse(agentData.response);
                            printLog(dataConstants.info, 'Agent Data Fetched successfully', JSON.parse(agentData.response));

                            printLog(dataConstants.info, 'is_department_manadatory', args.iparams.fsMandatoryFields["is_department_manadatory"]);
                            if(args.iparams.fsMandatoryFields["is_department_manadatory"].value == true) {
                                var fsGetRequesterURL = fsBaseURL + urlConstants.fs_requester_url + agentDetails.contact.email;

                                 getRequestApi(fsGetRequesterURL, args, "Requester Data Fetch", dataConstants.freshservice)
                                 .then(requesterData => {
                                    printLog(dataConstants.info, 'Requester Data fetched successfully', requesterData.response);
                                    var requesters = JSON.parse(requesterData.response).requesters;
                                    if(requesters.length > 0) {
                                        var requesterDepartments = requesters[0].department_ids;
                                        printLog(dataConstants.info, "Requester Departments", requesterDepartments);
                                        if(requesterDepartments.length > 0) {
                                            requestersDeptId = requesterDepartments[0];
                                        }  
                                    } 
                                    printLog(dataConstants.info, 'Requester Dept Id', requestersDeptId);
                                    createTicketInFS(args, eventType, fsBaseURL, agentDetails, requestersDeptId);
                                 })
                                 .catch(function(e) {
                                    printLog(dataConstants.error, 'Error in fetching Freshservice requester', e);
                                 });
                            }
                            else {
                                createTicketInFS(args, eventType, fsBaseURL, agentDetails, requestersDeptId);
                            }
                        })
                        .catch(function(e) {
                            printLog(dataConstants.error, 'Error in fetching agent data', e);
                        });
                }
            }
        }
    }
}

function createTicketInFS(args, eventType, fsBaseURL, agentDetails, requestersDeptId) {
    printLog(dataConstants.info, "In createTicketInFS");
    var fsTicketDetails = [];
    var fsAddTktURL = fsBaseURL + urlConstants.ticket_url;
    var headers = {
        "Authorization": util.getFsAPIKey(args),
        "ContentType": "application/json",
        "Accept": "application/json"
    };

    var options = {
        headers: headers,
        json: getTicketPropertiesJson(args, agentDetails.contact.email, fsBaseURL, requestersDeptId)
    };

    postRequestAPI(fsAddTktURL, options, "Ticket Creation")
        .then(ticketData => {
            printLog(dataConstants.info, 'Ticket created successfully');
            fsTicketDetails = ticketData.response.ticket;
            setDataInDataStore(args.data.ticket.id, { "fsTicketId": fsTicketDetails.id });
            if (eventType == dataConstants.event_ticket_update) {
                if (args.iparams.ruleMap.add_private_note) {
                    var fdTktGetConvoURL = fdBaseURL + urlConstants.ticket_url + args.data.ticket.id + urlConstants.conversations;
                    getRequestApi(fdTktGetConvoURL, args, "Freshdesk Conversation fetch", dataConstants.freshdesk)
                        .then(fdConvoData => {
                            var fdTktConversations = JSON.parse(fdConvoData.response);
                            for (var convo in fdTktConversations) {
                                var fsTktAddCovoURL = fsBaseURL + urlConstants.ticket_url + fsTicketDetails.id + urlConstants.notes;
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
                                        printLog(dataConstants.info, 'Conversation created successfully', fsConvoData);
                                    })
                                    .catch(function(e) {
                                        printLog(dataConstants.error, 'Error in conversation create', e);
                                    });
                            }
                        })
                        .catch(function(e) {
                            printLog(dataConstants.error, 'Error in conversation fetch', e);
                        });
                }
            }
        })
        .catch(function(e) {
            printLog(dataConstants.error, 'Error in create ticket', e);
        });
}

function getTicketPropertiesJson(args, requester_email, fsBaseURL, requestersDeptId) {
    printLog(dataConstants.info, "In getTicketPropertiesJson");
    var tktFieldJson = {};
    var subjectWithFdTktId = `[#FD-${args.data.ticket.id}] ${args.data.ticket.subject}`;
    tktFieldJson["status"] = 2; // default status - open
    tktFieldJson["priority"] = 1; // default priority - low
    tktFieldJson["source"] = 2; // source - portal
    tktFieldJson["urgency"] = 1; // urgency - low
    tktFieldJson["impact"] = 1; // impact - low
    tktFieldJson["subject"] = subjectWithFdTktId;
    tktFieldJson["email"] = requester_email;
    tktFieldJson["description"] = args.data.ticket.description;

    var fsMandatoryTktFlds = args.iparams.fsMandatoryFields;
    var customFldTypesList = ["custom_text", "custom_paragraph", "custom_number", "custom_decimal", "custom_checkbox", "custom_date", "custom_dropdown", "nested_field"];
    var customFieldMap = {};
    var currentKey;

    printLog(dataConstants.info, "Freshservice Mandatory Tkt Fields" + JSON.stringify(fsMandatoryTktFlds));
    for (var key in fsMandatoryTktFlds) {
        if(key != "is_department_manadatory") {
            currentKey = fsMandatoryTktFlds[key];
            if(customFldTypesList.includes(currentKey.type)) {
                if(currentKey.type == "custom_number") {
                    customFieldMap[currentKey.name] = parseInt(currentKey.value);
                }
                else if(currentKey.type == "custom_date") {
                    var formattedDate = moment(currentKey.value, ["YYYY-MM-DD"]).format("YYYY-MM-DD");
                    customFieldMap[currentKey.name] = formattedDate;
                }
                else {
                    customFieldMap[currentKey.name] = currentKey.value;
                }
            }
            else if(currentKey.type == "default_group") {
                tktFieldJson["group_id"] = parseInt(currentKey.value);
            }
            else if(currentKey.type == "default_agent") {
                tktFieldJson["responder_id"] = parseInt(currentKey.value);
            }
            else {
                tktFieldJson[currentKey.name] = currentKey.value;
            }
        }
    }

    if(requestersDeptId) {
        tktFieldJson["department_id"] = requestersDeptId;
    }

    tktFieldJson["custom_fields"] = customFieldMap;
    printLog(dataConstants.info, "Ticket Fiels JSON", JSON.stringify(tktFieldJson));
    return tktFieldJson;
}

function setDataInDataStore(key, value) {
    $db.set(key, value)
        .then(
            function(dbSuccessData) {
                printLog(dataConstants.info, "Data saved successfully in data store", JSON.stringify(dbSuccessData));
            },
            function(dbError) {
                printLog(dataConstants.error, "Error in saving data in data store", JSON.stringify(dbError));
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
        printLog(dataConstants.info, "FD - onTicketUpdateCallback");
        var fdBaseURL = urlConstants.protocol + args.iparams.fd_subdomain + urlConstants.fd_domain_suffix;
        var fsBaseURL = urlConstants.protocol + args.iparams.fs_subdomain + urlConstants.fs_domain_suffix;
        getDataFromDataStore(args.data.ticket.id)
            .then(dbResponse => {
                if (dbResponse.status == "success") {
                    printLog(dataConstants.info, "FS Ticket is already created for this FD Ticket", JSON.stringify(dbResponse.data));
                    if (args.data.ticket.changes.status) {
                        var fsTktId = dbResponse.data["fsTicketId"];
                        printLog(dataConstants.info, "On FD Status Update", args.iparams.fd_status_updated);
                        if (args.iparams.fd_status_updated == dataConstants.add_private_note_in_fs) {
                            var fdGetTktStatusFieldURL = fdBaseURL + urlConstants.ticket_status_url;
                            getRequestApi(fdGetTktStatusFieldURL, args, "Freshdesk status details fetch", dataConstants.freshdesk)
                                .then(fdTktStatusData => {
                                    var statusDetails = JSON.parse(fdTktStatusData.response);
                                    var statusChoices = statusDetails[0]["choices"];
                                    var oldStatus = statusChoices[args.data.ticket.changes.status[0]][0];
                                    var newStatus = statusChoices[args.data.ticket.changes.status[1]][0];
                                    var msg = `<div>Note Content: <div>Status has been updated from ${oldStatus} to ${newStatus}</div></div>`;
                                    printLog(dataConstants.info, "Note", msg);
                                    var fsTktAddPvtNoteURL = fsBaseURL + urlConstants.ticket_url + fsTktId + urlConstants.notes;
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
                                            printLog(dataConstants.info, 'Private Note created successfully', noteData);
                                        })
                                        .catch(function(e) {
                                            printLog(dataConstants.error, 'Error in conversation create', e);
                                        });
                                })
                                .catch(function(e) {
                                    printLog(dataConstants.error, 'Error in FD status details fetch', JSON.stringify(e));
                                });
                        } else {
                            printLog(dataConstants.info, "Do nothing in Freshservice on status change in Freshdesk");
                        }
                    }
                } else {
                    createTicket(args, dataConstants.event_ticket_update);
                }
            })
            .catch(e => {
                printLog(dataConstants.error, 'Error in fetching data from data store', JSON.stringify(e));
            });
    },

    onTicketCreateCallback: function(args) {
        printLog(dataConstants.info, "FD - onTicketCreateCallback");
        getDataFromDataStore(args.data.ticket.id)
            .then(dbResponse => {
                if (dbResponse.status == "success") {
                    printLog(dataConstants.info, "FS Ticket is already created for this FD Ticket", JSON.stringify(dbResponse.data));
                } else {
                    createTicket(args, dataConstants.event_ticket_create);
                }
            })
            .catch(e => {
                printLog(dataConstants.error, 'Error in fetching data from data store', JSON.stringify(e));
            });
    },

    onConversationCreateCallback: function(args) {
        printLog(dataConstants.info, "On FD Note Create", args.iparams.fd_note_added);
        if (args.iparams.fd_note_added == dataConstants.add_private_note_in_fs &&
            !args.data.conversation.body.startsWith("<div>Note Content: ")) {

            printLog(dataConstants.info, "Create Note in FS");
            var fsBaseURL = urlConstants.protocol + args.iparams.fs_subdomain + urlConstants.fs_domain_suffix;
            var ticketId = args.data.conversation.ticket_id;
            getDataFromDataStore(ticketId)
                .then(dbResponse => {
                    if (dbResponse.status == "success") {
                        var fsTktId = dbResponse.data["fsTicketId"];
                        var fsTktAddCovoURL = fsBaseURL + urlConstants.ticket_url + fsTktId + urlConstants.notes;
                        var msg = `<div>Note Content: ${args.data.conversation.body}</div>`;
                        printLog(dataConstants.info, "Note", msg);
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
                                printLog(dataConstants.info, 'Private Note created successfully', noteData);
                            })
                            .catch(function(e) {
                                printLog(dataConstants.error, 'Error in conversation Creation', JSON.stringify(e));
                            });
                    } else {
                        printLog(dataConstants.error, "This ticket is not present in FS", JSON.stringify(dbResponse));
                    }
                })
                .catch(e => {
                    printLog(dataConstants.error, 'Error in fetching data from data store', JSON.stringify(e));
                });
        } else {
            printLog(dataConstants.info, "Do nothing in Freshservice on note creation in Freshdesk");
        }
    }

};