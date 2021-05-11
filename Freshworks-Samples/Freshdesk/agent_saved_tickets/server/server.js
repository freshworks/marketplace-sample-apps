exports = {
    saveToAgentsTickets: async function (request) {
        saveTicketForAgent(request).then(
            function(data) {
                renderData(null, data); 
            }, 
            function(error) {
                renderData(error, null); 
            }
        )
    },
    getAgentTickets: async function (request) {
        getAgentTicketsFromDb(request.agentId).then(
            function(data) {
                renderData(null, data); 
            }, 
            function(errorMessage) {
                renderData(null, []);
            }
        )
    },
    removeAgentsTicket: async function (request) {
        console.log('Remove request received ' + JSON.stringify(request));
        if (request == null || request.agentId == null) {
            renderData(null,  {'message': 'Agent ID cannot be empty'}); 
            return; 
        }

        if (request.ticketId == null) {
            renderData(null, {'message': 'Ticket ID cannot be empty'}); 
            return; 
        }

        removeAgentTicket(request.agentId, request.ticketId)
        .then(
            function(data) {
                renderData(null, data); 
            }, 
            function(error) {
                renderData(error, null); 
            }
        );
    }
};

async function saveTicketForAgent(request) {
    try {
        console.log('Saving ticket with data ' + JSON.stringify(request)); 

        let existingTickets = null; 

        try {
            existingTickets = await getAgentTicketsFromDb(request.agentId)
        } catch(err) {
            // Do nothing 
        }

        console.log('Existing tickets are ' + JSON.stringify(existingTickets)); 

        if (existingTickets === null || existingTickets.savedTickets === null) {
            console.log('Existing ticket is null. Saving the first ticket'); 
            let saveTicketResponse = await saveTicketInDb(request.agentId, request.ticketId, request.ticketSubject);
            console.log('Save ticket response for first ticket ' + JSON.stringify(saveTicketResponse)); 

            return saveTicketResponse; 
        }

        console.log("There are few existing tickets for agent: " + existingTickets.savedTickets); 
        let filteredTicketByRequestedId = existingTickets.savedTickets.filter((ticket) => ticket.ticketId === request.ticketId);

        if (filteredTicketByRequestedId.length > 0) {
            console.log("Ticket ID " + request.ticketId + " is already added for agent ID " + request.agentId); 
            return 'Ticket already added'; 
        }

        console.log('Trying to add ticket to existing ticket'); 

        let saveTicketResponse = await saveTicketInDb(request.agentId, request.ticketId, request.ticketSubject);
        console.log('Save ticket response for adding ticket ' + JSON.stringify(saveTicketResponse)); 
        
        return saveTicketResponse; 

    } catch(err) {
        console.error(err); 
        throw err; 
    }
}

async function removeAgentTicket(agentId, ticketId) {
    try {
        let existingTickets = null; 

        try {
            existingTickets = await getAgentTicketsFromDb(agentId);
        } catch(err) {
            throw "Ticket is not saved for the agent";
        }

        console.log('Existing tickets are ' + JSON.stringify(existingTickets)); 

        if (existingTickets === null || existingTickets.savedTickets === null) {
            console.log('No saved ticket. Returning error');
            throw "Ticket is not saved for the agent"; 
        }

        console.log("There are few existing tickets for agent: " + JSON.stringify(existingTickets.savedTickets)); 
        let filteredTicketByRequestedId = existingTickets.savedTickets.filter((ticket) => ticket.ticketId === ticketId);

        console.log(filteredTicketByRequestedId);

        if (filteredTicketByRequestedId.length == 0) {
            throw "Ticket is not saved for the agent"; 
        }

        let remainingTickets = existingTickets.savedTickets.filter((ticket) => ticket.ticketId !== ticketId);

        return $db.update("agentId: " + agentId, "set", { savedTickets: remainingTickets})
        .then(
            function (response) {
                console.log('Removed the ticket ' +  ticketId + ' from agent with id ' + agentId);
                return response;
            },
            function (error) {
                console.error('Failed to remove the ticket' + JSON.stringify(error));
                throw 'Failed to remove ticket';
            }
        );

    } catch(err) {
        console.error(err); 
        throw err; 
    }
}

function getAgentTicketsFromDb(agentId) {
    try {
        console.info("Getting tickets for agent with ID " + agentId); 
        return $db.get("agentId: " + agentId)
    } catch(err) {
        console.error('Error while fetching saved ticket ' + JSON.stringify(err));
        return null; 
    };
}

function saveTicketInDb(agentId, ticketId, ticketSubject) {
    console.log('Saving ticket in DB for agent ID ' + agentId + ' and ticket ID ' + ticketId);
    if (agentId === null || agentId === undefined || ticketId === null || ticketId === undefined) {
        throw 'Agent ID and ticket ID cannot be null'; 
    }

    return $db.update("agentId: " + agentId, "append", { savedTickets: [{'ticketId': ticketId, 'ticketSubject': ticketSubject}]})
        .then(
            function (response) {
                console.log('Appended the tickets for agent ID ' + agentId);
                return response;
            },
            function (error) {
                console.error('Failed to update ticket: ' + JSON.stringify(error));
            }
        );
}
