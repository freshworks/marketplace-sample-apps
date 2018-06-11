'use strict';

$(document).ready(function() {
  var ticketId = '', userId = '', tickets = [], currentTicketObj = {}, domainName = '';

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
    var arr = ['id', 'subject', 'description_text'];
    var trimmedObj = {};
    arr.forEach(function(val){
      trimmedObj[val] = ticketObj[val];
    });
    return trimmedObj;
  }

  // Updates the tickets array
  function changeBookmarks(type, ticketObj) {
    return getBookmarks().then(function(result) {
      var index = (result.tickets || []).map(function(val){ return val.id;}).indexOf(ticketObj.id);
      if(type == 'add') {
        if(index < 0) {
          tickets.push(pickKeysFromObj(currentTicketObj));
          setBookmarks();
        }
      }
      else if (type == 'remove') {
        if(index > -1) {
          tickets.splice(index , 1);
          setBookmarks();
        }
      }
    }, function(error) {
      if(error.status == 404 && type == 'add') {
        tickets = [ pickKeysFromObj(currentTicketObj) ];
        setBookmarks();
      }
    });
  }

  //Displays the updated the list in the UI
  function displayBookmarks() {
    $('.bookmarks-ul').html('');
    var template = '<li class="bookmarks-li"><a href="https://${domainName}/a/tickets/${id}" target="_top" class="bookmark-link">${subject}</a></li>';
    tickets.forEach(function(val){
      val.domainName = domainName;
      $.tmpl( template, val).appendTo('.bookmarks-ul');
    });

    if(tickets.find(function(val){ return val.id == ticketId;})){
      $('#add_to_bookmarks').prop('disabled', true);
    }
    else{
      $('#add_to_bookmarks').prop('disabled', false);
    }

    $('.bookmarks-li').each(function(index, el){
      $clamp(el, {clamp: 2});
    });
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
    
    $('#add_to_bookmarks').on('click', function() {
      if(userId && ticketId) {
        changeBookmarks('add', currentTicketObj);
      }
    });
    
    $('#manage_bookmarks').on('click', function() {
      client.interface.trigger("showModal", {
        title: "Manage Bookmarks",
        template: "modal.html",
        data: {
          tickets: tickets,
          userId: userId
        }
      });
    });
    
    client.instance.receive(
      function(event)  {
        var data = event.helper.getData();
        if(data.message.type == 'removeTicket') {
          changeBookmarks('remove', { id: data.message.ticketId });
        }
      }
    );
  });
});