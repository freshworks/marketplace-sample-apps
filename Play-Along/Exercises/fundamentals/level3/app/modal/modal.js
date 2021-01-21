document.addEventListener("DOMContentLoaded", function () {
  app.initialized()
    .then(function (_client) {
      window.client = _client;
      client.instance.context()
        .then(function (context) {
          onModalLoad(context.data);
        })
        .catch(function (error) {
          console.error('error', error);
        });
    });
});

/**
 * Function that is triggered on Modal load.
 * @param {object} ticket  ticket that is fetched from parent
 */
function onModalLoad(ticket) {
  var ticketID = ticket.id;
  getIssue(ticketID, function (data) {
    issueNumber = data.issue_data.issueNumber;
    fetchIssue(issueNumber);
  });
}

/**
 * Retrieve the issue from data storage
 * @param {Number} ticketID Ticket ID
 * @param {function} callback Callback function
 */
function getIssue(ticketID,callback) {
  var dbKey = String(`fdTicket:${ticketID}`).substr(0, 30);
  client.db.get(dbKey)
    .then(callback)
    .catch(function (error) {
      //404 - Indicates that the record is not found in the data storage
      if (error.status === 404) {
        console.error("No issue found for ticket", error);
        document.getElementById('modal').insertAdjacentHTML('beforeend',
          `<div class="alert alert-warning" role="alert">
            <img src="https://media.tenor.com/images/a48310348e788561dc238b6db1451264/tenor.gif" width="120px"/>
            <hr>
            Seems like there's no issue associated with this ticket. Please created one using 'Create Issue' button
          </div>`);
      }
    })
}

/**
 * Function to fecth issue from github, authorization is done using Oauth
 * @param {string} issueID  Issue number to query specific  ticket from github
 */
function fetchIssue(issueID) {
  var options = {
    headers: {
      Authorization: 'token <%= access_token %>',
      'User-Agent': 'FreshHuddle Sample User Agent'
    },
    isOAuth: true
  };
  client.request.get(`https://api.github.com/repos/<%= iparam.github_repo %>/issues/${issueID}`, options)
    .then(function (data) {
      try {
        data = JSON.parse(data.response);
        document.getElementById('modal').insertAdjacentHTML('beforeend',
          `<h3> Issue title: ${data.title} </h3><p>Description: ${data.body}</p> <p> Issue Number: ${data.number}</p> <p>Issue ID: ${data.id}</p><p> Issue Status: ${data.state}</p>`);
      } catch (error) {
        console.error("Error while attempting to show issue", error);
      }
    })
    .catch(function (error) {
      console.error("error", error);
    });
}
