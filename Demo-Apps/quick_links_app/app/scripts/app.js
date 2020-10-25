'use strict';

document.addEventListener("DOMContentLoaded", function(){
  let ticketId = '', userId = '', tickets = [], currentTicketObj = {}, domainName = '';

  function renderApp() {
    return Promise.all([client.data.get('loggedInUser'), client.data.get('ticket'), client.data.get('domainName')]);
  }

  // Saves the changes to the db
  function setBookmarks() {
    client.db.set("ticket_bookmarks:" + userId, {tickets: tickets})
    .then(null, function(error) {
      client.interface.trigger("showNotify", {type: "danger", title: "Error", message: "Changes could not be saved. Please try again."});
    }).finally(function(){
      displayBookmarks();
    });
  }

  // Gets the bookmarks from the db
  function getBookmarks() {
    return client.db.get("ticket_bookmarks:"+ userId);
  }

  // Picks specific keys from the object
  function pickKeysFromObj(ticketObj) {
    let arr = ['id', 'subject', 'description_text'];
    let trimmedObj = {};
    arr.forEach(function(val){
      trimmedObj[val] = ticketObj[val];
    });
    return trimmedObj;
  }

  // Updates the tickets array
  function changeBookmarks(type, ticketObj) {
    return getBookmarks().then(function(result) {
      let index = (result.tickets || []).map(function(ticket){ return ticket.id;}).indexOf(ticketObj.id);
      if(type === 'add') {
        if(index < 0) {
          tickets.push(pickKeysFromObj(currentTicketObj));
          setBookmarks();
        }
      }
      else if (type === 'remove') {
        if(index > -1) {
          tickets.splice(index , 1);
          setBookmarks();
        }
      }
    }, function(error) {
      if(error.status === 404 && type === 'add') {
        tickets = [ pickKeysFromObj(currentTicketObj) ];
        setBookmarks();
      }
    });
  }

  //Displays the updated the list in the UI
  function displayBookmarks() {
    let bookmark = document.getElementsByClassName('bookmarks-ul')[0];
    bookmark.innerHTML = '';

    function setTemplate ({id, domainName, subject}){
      return `<li class="bookmarks-li"><a href="https://${domainName}/a/tickets/${id}" target="_blank" class="bookmark-link">${subject}</a></li>`;
    }

    tickets.forEach(function(val){
      val.domainName = domainName;
      bookmark.innerHTML += setTemplate(val);
    });

    if(tickets.find(function(val){ return val.id === ticketId;})){
      document.getElementById('add_to_bookmarks').disabled = true;
    }
    else{
      document.getElementById('add_to_bookmarks').disabled = false;
    }

    let bookmarksList = document.getElementsByClassName('bookmarks-li');
    if(bookmarksList > 0){
      bookmarksList.forEach(function(index, el){
        $clamp(el, {clamp: 2});
      });
    }
  }

  app.initialized().then(function(client) {
    window.client = client;

    renderApp().then(function(value){
      userId = value[0].loggedInUser.id;
      ticketId = value[1].ticket.id;
      domainName = value[2].domainName;

      currentTicketObj = value[1].ticket;
      if(userId && ticketId) {
        getBookmarks().then (function(records) {
          tickets = records.tickets || [];
          displayBookmarks();
        });
      }
    });

    document.getElementById('add_to_bookmarks').addEventListener('click', function() {
      if(userId && ticketId) {
        changeBookmarks('add', currentTicketObj);
      }
    });

    document.getElementById('manage_bookmarks').addEventListener('click', function() {
      client.interface.trigger("showModal", {
        title: "Manage Bookmarks",
        template: "views/modal.html",
        data: {
          tickets: tickets,
          userId: userId
        }
      });
    });

    client.instance.receive(
      function(event)  {
        let data = event.helper.getData();
        console.log('msg type', data.message.type)
        if(data.message.type === 'removeTicket') {
          changeBookmarks('remove', { id: data.message.ticketId });
        }
      }
    );
  });
});
