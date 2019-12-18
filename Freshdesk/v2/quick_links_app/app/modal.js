'use strict';

$(document).ready(function() {
  app.initialized()
  .then(function(_client) {
    var client = _client;
    var bookmarkData = {};
    client.instance.context()
    .then(function(context) {
      bookmarkData = context.data;
      var template = '<li data-ticket-id="${id}" class="row manage-bm-li">\
                        <div class="ticket-title">${subject}</div>\
                        <div class="remove-ticket-bm"><a class="remove-bookmark"><img src="delete.svg" /></a></div>\
                      </li>';

      $.tmpl( template, bookmarkData.tickets).appendTo('.manage-bm-ul');

      $('.manage-bm-ul .ticket-title').each(function(index, el){
        $clamp(el, {clamp: 2});
      });
    });

    $('.manage-bookmarks').on('click', '.remove-bookmark', function() {
      var ticketId = $(this).parents('.manage-bm-li').data('ticketId');
      $(this).parents('.manage-bm-li').remove();
      client.instance.send({ 
        message: {type: 'removeTicket', ticketId: ticketId}
      }); 
    });
  });
});
  