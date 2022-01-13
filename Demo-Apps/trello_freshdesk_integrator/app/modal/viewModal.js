'use strict';

document.addEventListener("DOMContentLoaded", function () {
  app.initialized()
    .then(function (_client) {
      window.client = _client;
      client.instance.context()
        .then(function (context) {
          onModalLoad(context.data);
        })
        .catch(function (error) {
          console.error('error in instance context ');
          console.error(error);
        });
    }).catch(function (error) {
      console.error('Error during initialization');
      console.error(error);
    });
});

/**
 * Function that is triggered on Modal load.
 * @param {object} ticket  ticket that is fetched from parent
 */

 function onModalLoad(ticket) {
  let ticketID = ticket;
  getCard(ticketID, function (data) {
    let cardId = data.card_data.cardID;
    fetchCard(cardId);
  });
}

/**
 * Retrieve the card data from data storage
 * @param {Number} ticketID Ticket ID
 * @param {function} callback Callback function
 */
function getCard(ticketID, callback) {
  let dbKey = String(`fdTicket:${ticketID}`).substring(0, 30);
  client.db.get(dbKey)
    .then(callback)
    .catch(function (error) {
      //404 - Indicates that the record is not found in the data storage
      if (error.status === 404) {
        console.error("No Card found for the ticket");
        console.error(error);
        document.getElementById('viewModal').insertAdjacentHTML('beforeend',
          `<div class="alert alert-warning" role="alert">
            <hr>
            Seems like there's no card associated with this ticket. Please create one using 'Create Card' button
          </div>`);
      }
    })
}

/**
 * Function to fetch and display card from trello
 * @param {string} cardID  card Id to query specific card from trello
 */
async function fetchCard(cardID) {
    try {
      // data is a json object with requestID and response.
      // The serverless environment generates the request ID.
      // The serverless method in server.js returns two objects (error,response).
      // data.response is the response object from the serverless method.
      let options = {
        "cardID": cardID,
      }
      let data = await client.request.invoke("fetchCardSMI", options);
      console.info("Server method Request ID is: " + data.requestID);
      data = (data.response);

      let date;
      if (data.dueComplete) {
        date = "Due completed"
      } else {
        date = new Date(data.due);
      }

      let labels = data.labels;
      let label;
      if (labels.length) {
        label = labels[0].name;
      } else {
        label = "Resolved";
      }

      document.getElementById('viewModal').insertAdjacentHTML('beforeend',
        `<table class="table">
          <thead class="thead-dark">
            <tr>
              <th >Card Title</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${data.name}</td>
            </tr>
          </tbody>
        </table>
  
        <table class="table">
          <thead class="thead-dark">
            <tr>
              <th >board</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td >${data.board.name}</td>
            </tr>
          </tbody>
        </table>
        
        <table class="table">
          <thead class="thead-dark">
            <tr>
              <th >list</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${data.list.name}</td>
            </tr>
          </tbody>
        </table>

        <table class="table">
        <thead class="thead-dark">
            <tr>
              <th >Member</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${data.members[0].username}</td>
            </tr>
          </tbody>
        </table>

        <table class="table">
        <thead class="thead-dark">
            <tr>
              <th >Label</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${label}</td>
            </tr>
          </tbody>
        </table>

        <table class="table">
        <thead class="thead-dark">
            <tr>
              <th >Due Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${date}</td>
            </tr>
          </tbody>
        </table>

        <a href=${data.shortUrl} target="_blank" class="btn btn-link" type="button">view in trello</a>

        <div class="col-md-4 text-center">
      <button class="btn btn-primary" onclick="back()">Back</button>
       </div>
        `)
    }
    catch (err) {
      // err is a json object with requestID, status, and message.
      // The serverless environment generates the request ID.
      // The serverless method in server.js returns two objects (error,response).
      // The error object contains the status and message attributes.
      // err.status is the error.status attribute.
      // err.message is the error.message attribute.
      console.info("Request ID: " + err.requestID);
      console.error("error status: " + err.status);
      console.error("error message: " + err.message);
    };
}

async function back() {
  await client.instance.close();
}

