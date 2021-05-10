document.onreadystatechange = function () {
    if (document.readyState === 'interactive') renderApp();

    function renderApp() {
        var onInit = app.initialized();

        onInit.then(getClient).catch(handleErr);

        function getClient(_client) {
            window.client = _client;
            client.events.on('app.activated', onAppActivate);

            client.instance.resize({ height: "500px" });
        }
    }
};

function onAppActivate() {
    updateAgentTickets(); 
}

function updateAgentTickets() {
    client.iparams.get('freshdesk_domain_prefix').then(
        function(freshdeskDomainPrefix) {
            getLoggedInUser().then(
                function(loggedInUser) {
                    let data = {
                        'agentId': loggedInUser.id
                    };
        
                    client.request.invoke('getAgentTickets', data)
                        .then(
                            function(response) {
                                console.log(document.location.href);
        
                                console.log('Tickets received from the backend are'); 
                                console.log(response.response.savedTickets); 

                                var agentTicketsTable = document.getElementById('agentTicketsTable');

                                if (response.response.savedTickets == null || response.response.savedTickets.length === 0) {
                                    agentTicketsTable.style.display = "none";
                                    return;
                                } 

                                agentTicketsTable.style.display = "table";
        
                                // Clear existing rows but header 
        
                                var rowCount = agentTicketsTable.rows.length;
                                for (var x = rowCount-1; x > 0; x--) {
                                    agentTicketsTable.deleteRow(x);
                                }
        
                                response.response.savedTickets.forEach(ticket => {
                                    insertRow(freshdeskDomainPrefix['freshdesk_domain_prefix'], ticket.ticketId, ticket.ticketSubject); 
                                });
                            }, 
                            function(error) {
                                alert(error); 
                            }
                        ) 
                });
        },
        function(error) {
            console.error(error);
            document.innerHTML = "Please set the FreshDesk Domain Prefix";
        });
}

function insertRow(freshdeskDomainPrefix, ticketId, ticketSubject) {
    var table = document.getElementById('agentTicketsTable').insertRow(1);

    var c1 = table.insertCell(0);
    var c2 = table.insertCell(1);
    var c3 = table.insertCell(2);
    
    c1.innerHTML = '<a target="blank" href="https://' + freshdeskDomainPrefix + '.freshdesk.com/a/tickets/'
        + ticketId + '?dev=true">' + ticketId + '</a>';
    // '<a href=' + window.location.hostname + 'a/tickets/' + ticketId + '>' + ticketId + '</a>';
    c2.innerHTML = ticketSubject;
    c3.innerHTML = '<input id="' + ticketId +  '" type="image" src="styles/images/removeRed.svg" style="height:20px; width:20px" onClick="removeTicket(this);"/>';
}

function saveToAgentsTickets() {
    getLoggedInUser().then(function(loggedInUser) {
        console.log('Logged in user is');
        console.log(loggedInUser);

        getCurrentTicket().then(function(ticket) {
            let data = {
                'agentId': loggedInUser.id,
                'ticketId': ticket.id, 
                'ticketSubject': ticket.subject
            };
            
            console.log('Saving current ticket with data ' + JSON.stringify(data));

            client.request.invoke("saveToAgentsTickets", data).then(
                    function(data) {
                        console.log("server method response is: ");
                        console.log(data);

                        updateAgentTickets();
                    },
                    function(err) {
                        alert('Error while saving the ticket ' + err);
                        console.error('Error while saving ticket');
                        console.error(err);
                    });
        })
    });
}

function removeTicket(ticket) {
    getLoggedInUser().then(function(loggedInUser) {
        console.log('Logged in user is');
        console.log(loggedInUser); 
        let data = {
            'agentId': loggedInUser.id,
            'ticketId': parseInt(ticket.id)
        }
        client.request.invoke("removeAgentsTicket", data).then(
            function(data) {
                console.log("server method response is: ");
                console.log(data);

                updateAgentTickets();
            },
            function(err) {
                alert('Error while saving the ticket ' + err);
                console.error('Error while saving ticket');
                console.error(err.message);
            });
    });
}

function getLoggedInUser() {
    return client.data.get("loggedInUser").then(
        function(response) {
            return response.loggedInUser;
        }, 
        function(error) {
            console.error('Error while getting logged in user' + JSON.stringify(error));
        }
    );
}

function getCurrentTicket() {
    return client.data.get("ticket").then (
        function(data) {
          console.log("Ticket details are ");
          console.log(data);
          return data.ticket;
        },
        function(error) {
          // failure operation
          console.error('Error while fetching ticket details ' + JSON.stringify(error));
        }
    );
}

function handleErr(err) {
    console.error(`Error occured. Details:`, err);
}
