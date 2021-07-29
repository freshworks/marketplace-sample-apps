function alertFreshdesk(message) {
  return client.interface.trigger("showNotify", {
    type: "alert",
    title: "Try again",
    message,
  });
}

document.addEventListener("DOMContentLoaded", function () {
  app.initialized().then(function (_client) {
    var client = _client;
    window.client = client;
    client.instance
      .context()
      .then(function (context) {
        var loggedInUser = context.data.id;
        getRelatedTickets(loggedInUser);
      })
      .catch(function () {
        return alertFreshdesk("Error opening modal");
      });
  });
});
/**
 * This gets all the tickets assigned to the agent
 * @param {*} client
 * @param {*} iparams
 * @param {*} loggedInUser
 */
function getAllAgentTickets(loggedInUser) {
  return new Promise(function (resolve, reject) {
    options = {
      headers: {
        Authorization: "Basic <%= encode(iparam.fd_api_key) %>",
      },
    };
    var baseUrl = `https://${fd_domain}/api/v2/search/tickets?query="agent_id:${loggedInUser}"`;
    client.request
      .get(baseUrl, options)
      .then(function (resp) {
        var { total } = JSON.parse(resp.response);
        return Math.floor(total / 30 + 1);
      })
      .then(function (totalPages) {
        var ticketPromises = [];
        for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
          url = `${baseUrl}&page=${pageNumber}`;
          ticketPromises.push(client.request.get(url, options));
        }
        return Promise.all(ticketPromises);
      })
      .then(function (resolvedTickets) {
        var allAgentTickets = [];
        resolvedTickets.forEach(function (resolvedTicket) {
          allAgentTickets = allAgentTickets.concat(
            JSON.parse(resolvedTicket.response).results
          );
        });
        return resolve(allAgentTickets);
      })
      .catch(function (er) {
        console.error(`Couldnt retrieve tickets. Status : ${er.status}`);
        reject(er);
      });
  });
}
/**
 * This will generate list based on the tickets
 * inside modal
 * @param {*} allAgentTickets
 */
function generateList(allAgentTickets) {
  var ticketDetailsHTML = "";
  allAgentTickets.forEach(function (agentTicket) {
    var { id, subject } = agentTicket;
    ticketDetailsHTML += `<li class = 'ticket-detail'> TICKET : #
                              <a class = 'link' href = 'https://${fd_domain}/a/tickets/${id}'> ${id}</a>
                              SUBJECT : ${subject}
                              </li>`;
  });
  document.getElementById("wait-text").remove();
  document
    .getElementById("ticket-details")
    .insertAdjacentHTML("beforeend", ticketDetailsHTML);
}
/**
 * @param {*} client
 * @param {*} loggedInUser
 */
function getRelatedTickets(loggedInUser) {
  client.data
    .get("domainName")
    .then(function (result) {
      var fd_domain = result.domainName;
      window.fd_domain = fd_domain;
      return getAllAgentTickets(loggedInUser);
    })
    .then(function (allAgentTickets) {
      generateList(allAgentTickets);
    })
    .catch(function () {
      return alertFreshdesk("Error retrieving tickets");
    });
}
