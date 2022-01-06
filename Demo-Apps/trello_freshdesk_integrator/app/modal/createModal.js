'use strict';

var idlist;
var idmember;

document.addEventListener("DOMContentLoaded", function () {
  app.initialized()
    .then(function (_client) {
      window.client = _client;
      client.instance.context().then(function (context) {
        console.log('Modal instance API context');
        //data passed from App to modal
        q('#title').value = context.data.sub;
        q('#desc').value = context.data.desc;
        q('#priority').value = context.data.priority;
        q('#due').value = (context.data.date).slice(0, -1);
        q('#ticketId').value = context.data.ticketId;
        idlist = context.data.list;
        idmember = context.data.member;
      }).catch(function (error) {
        console.error('error in instance context :', error);
      });
    }).catch(function (error) {
      console.error('Error during initialization ', error);
    });
});


function q(selector) {
  return document.querySelector(selector);
}

function addList() {
  idlist.forEach(obj => {
    let optionText = obj.name;
    let optionValue = obj.id;
    $('#idList').append(new Option(optionText, optionValue));
  });
}

function addMembers() {
  idmember.forEach(obj => {
    let optionText = obj.username;
    let optionValue = obj.id;
    $('#members').append(new Option(optionText, optionValue));
  });
}


function createLink() {
  window.frsh_init().then(function (client) {

    let sub = q('#title').value;
    let desc = q('#desc').value;
    let date = q('#due').value;
    let priority = q('#priority').value;
    var tId = q('#ticketId').value;
    var idList = q('#idList').value;
    var idMember = q('#members').value;
    let cardId;
    let color;
    switch (priority) {
      case "Urgent":
        color = "red";
        break;
      case "High":
        color = "yellow";
        break;
      case "Medium":
        color = "blue";
        break;
      case "Low":
        color = "green";
        break;
    }

    /**
     * Makes an API call to trello to create an card for the ticket
     */
    let edesc = encodeURIComponent(desc);
    let options = {
      "idList": idList,
      "idMembers": idMember,
      "name": sub,
      "desc": edesc,
      "due": date
    }

    client.request.invoke("postCardSMI", options).then(
      function (data) {
        // data is a json object with requestID and response.
        // The serverless environment generates the request ID.
        // The serverless method in server.js returns two objects (error,response).
        // data.response is the response object from the serverless method.
        console.log("Server method Request ID is: " + data.requestID);
        data = (data.response);
        cardId = data.id;
        createlabel(tId, cardId, priority, color);
      },
      function (err) {
        // err is a json object with requestID, status, and message.
        // The serverless environment generates the request ID.
        // The serverless method in server.js returns two objects (error,response).
        // The error object contains the status and message attributes.
        // err.status is the error.status attribute.
        // err.message is the error.message attribute.
        console.log("Request ID: " + err.requestID);
        console.log("error status: " + err.status);
        console.log("error message: " + err.message);
      });
  });


};

/**
* Makes an API call to trello to create an label for the card
*/
function createlabel(tId, cardId, priority, color) {
  let options = {
    "cardId": cardId,
    "name": priority,
    "color": color
  }
  client.request.invoke("postLabelSMI", options).then(
    function (data) {
      // data is a json object with requestID and response.
      // The serverless environment generates the request ID.
      // The serverless method in server.js returns two objects (error,response).
      // data.response is the response object from the serverless method.
      console.log("Server method Request ID is: " + data.requestID);
      console.log("card created successfully");
      let ticketObj = { ticketID: tId, cardID: cardId };
      setData(ticketObj);
      client.instance.send({ message: 'A Trello card is successfully created for this ticket' });
      client.instance.close();

    },
    function (err) {
      // err is a json object with requestID, status, and message.
      // The serverless environment generates the request ID.
      // The serverless method in server.js returns two objects (error,response).
      // The error object contains the status and message attributes.
      // err.status is the error.status attribute.
      // err.message is the error.message attribute.
      console.log("Request ID: " + err.requestID);
      console.log("error status: " + err.status);
      console.log("error message: " + err.message);
    });
}

/**
 * Store Trello card data using data storage 
 * @param {array} data card data to be set in data storage
 */
function setData(data) {
  var dbKey = String(`fdTicket:${data.ticketID}`).substring(0, 30);
  var dbKey2 = String(`trelloCard:${data.cardID}`).substring(0, 30);
  Promise.all([client.db.set(dbKey, { card_data: data }), client.db.set(dbKey2, { card_data: data })]).then(function () {
    console.info('A Trello card is successfully created for this ticket');
  })
    .catch(function (error) {
      console.error("Unable to persist data : ", error);
    });
}



