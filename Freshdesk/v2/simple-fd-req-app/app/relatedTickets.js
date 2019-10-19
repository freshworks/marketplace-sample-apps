$(document).ready( function() {
    app.initialized()
        .then(function(_client) {
          var client = _client;
          client.instance.context()
            .then(function(context) {
                var loggedInUser = context.data.id;
                getRelatedTickets(client, loggedInUser)
            })
    });
});
/**
 * This gets all the tickets assigned to the agent
 * @param {*} client 
 * @param {*} iparams 
 * @param {*} loggedInUser 
 */
function getAllAgentTickets(client, iparams, loggedInUser) {
    return new Promise(function(resolve, reject) {
            var { fd_domain, fd_api_key } = iparams,
            options  = {
                headers :  {
                    Authorization : `Basic ${fd_api_key}`
                }
            }
            var baseUrl = `https://${fd_domain}/api/v2/search/tickets?query="agent_id:${loggedInUser}"`;
            client.request.get(baseUrl, options)
                .then(function(resp) {
                    var { total } = JSON.parse(resp.response);
                    return Math.floor(total/30 + 1);
                })
                .then(function(totalPages) {
                    var ticketPromises = [];
                    for(let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
                        url = `${baseUrl}&page=${pageNumber}`;
                        ticketPromises.push(client.request.get(url, options))
                    }
                    return Promise.all(ticketPromises);
                })
                .then(function(resolvedTickets) {
                    var allAgentTickets = [];
                    resolvedTickets.forEach(function(resolvedTicket) {
                        allAgentTickets = allAgentTickets.concat(JSON.parse(resolvedTicket.response).results)
                    });
                    return resolve(allAgentTickets)
                })
                .catch(function(er) {
                    console.error(`Couldnt retrieve tickets. Status : ${er.status}`);
                    reject([]);
                })
    })
}
/**
 * This will generate list based on the tickets 
 * inside modal
 * @param {*} allAgentTickets 
 */
function generateList(allAgentTickets) {
    var ticketDetailsHTML = '';
    allAgentTickets.forEach(function(agentTicket) {
        var { id, subject } = agentTicket;
        ticketDetailsHTML += `<li class = 'ticket-detail'> TICKET : # 
                              <a class = 'link' href = 'https://${fd_domain}/a/tickets/${id}'> ${id}</a>
                              SUBJECT : ${subject}
                              </li>
                              `;
    });
    $('.wait-text').remove();
    $('.ticket-details').append(ticketDetailsHTML);
}
/**
 * @param {*} client 
 * @param {*} loggedInUser 
 */
function getRelatedTickets(client, loggedInUser) {
    console.info(client, loggedInUser);
    client.request.invoke('getIparams',{})
        .then(function(result) {
            console.info(result);
            var fd_api_key = result.response.fd_api_key;
            var fd_domain = result.response.fd_domain;
            window.fd_domain = fd_domain;
            return getAllAgentTickets(client, {fd_domain, fd_api_key}, loggedInUser);
        })
        .then(function(allAgentTickets) {
            generateList(allAgentTickets)
        })
}