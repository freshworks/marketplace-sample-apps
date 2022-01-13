'use strict';

let idlist;
let idmember;

document.addEventListener("DOMContentLoaded", function () {
  app.initialized()
    .then(function (_client) {
      window.client = _client;
      client.instance.context().then(function (context) {
        console.info('Modal instance API context');
        //data passed from App to modal
        select('#title').value = context.data.sub;
        select('#desc').value = context.data.desc;
        select('#priority').value = context.data.priority;
        select('#due').value = (context.data.date).slice(0, -1);
        select('#ticketId').value = context.data.ticketId;
        idlist = context.data.list;
        idmember = context.data.member;
      }).catch(function (error) {
        console.error('error in instance context');
        console.error(error);
      });
    }).catch(function (error) {
      console.error('Error during initialization');
      console.error(error);
    });
});


function select(selector) {
  return document.querySelector(selector);
}

function addList() {
  let id = document.getElementById('idList');
  idlist.forEach(obj => {
    let option = document.createElement("option");
    let optionText = obj.name;
    let optionValue = obj.id;
    option.text = optionText;
    option.value = optionValue;
    id.add(option);
  });
}

function addMembers() {
  let id = document.getElementById('members');
  idmember.forEach(obj => {
    let option = document.createElement("option");
    let optionText = obj.username;
    let optionValue = obj.id;
    option.text = optionText;
    option.value = optionValue;
    id.add(option);
  });
}


async function createLink() {
  let sub = select('#title').value;
  let desc = select('#desc').value;
  let date = select('#due').value;
  let priority = select('#priority').value;
  let tId = select('#ticketId').value;
  let idList = select('#idList').value;
  let idMember = select('#members').value;
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

  let data = await client.request.invoke("postCardSMI", options);
  data = (data.response);
  cardId = data.id;
  createlabel(tId, cardId, priority, color);
};

/**
* Makes an API call to trello to create an label for the card
*/
async function createlabel(tId, cardId, priority, color) {
  let options = {
    "cardId": cardId,
    "name": priority,
    "color": color
  }
  await client.request.invoke("postLabelSMI", options);
  let ticketObj = { ticketID: tId, cardID: cardId };
  setData(ticketObj);
  client.instance.send({ message: 'A Trello card is successfully created for this ticket' });
  client.instance.close();
}

/**
 * Store Trello card data using data storage 
 * @param {array} data card data to be set in data storage
 */
async function setData(data) {
  try {
    let dbKey = String(`fdTicket:${data.ticketID}`).substring(0, 30);
    let dbKey2 = String(`trelloCard:${data.cardID}`).substring(0, 30);
    await Promise.all([client.db.set(dbKey, { card_data: data }), client.db.set(dbKey2, { card_data: data })]);
    console.info('A Trello card is successfully created for this ticket');
  }
  catch (error) {
    console.error("Unable to persist data ");
    console.error(error);
  };
}



