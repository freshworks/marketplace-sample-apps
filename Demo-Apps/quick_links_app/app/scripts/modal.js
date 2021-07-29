"use strict";

function setTemplate({ id, subject }) {
  return `
    <li data-ticket-id="${id}" class="row manage-bm-li">\
      <div class="ticket-title">${subject}</div>\
      <div class="remove-ticket-bm" ><a class="remove-bookmark"><img src="../styles/images/delete.svg" /></a></div>\
    </li>
  `;
}

function getParent(elem, parentSelector) {
  for (; elem && elem !== document; elem = elem.parentNode) {
    if (elem.className.includes(parentSelector)) return elem;
  }
  return null;
}

document.addEventListener("DOMContentLoaded", function () {
  app.initialized().then(function (_client) {
    let client = _client;
    client.instance.context().then(function (context) {
      context.data.tickets.forEach(function (ticket) {
        document.getElementsByClassName("manage-bm-ul")[0].innerHTML +=
          setTemplate(ticket);
      });

      document.getElementsByClassName("remove-bookmark").forEach(function (el) {
        el.addEventListener("click", function () {
          let parent = getParent(this, "manage-bm-li");
          let ticketId = parseInt(parent.dataset.ticketId);
          parent.remove();
          client.instance.send({
            message: { type: "removeTicket", ticketId: ticketId },
          });
        });
      });

      document
        .getElementsByClassName("manage-bm-ul, ticket-title")
        .forEach(function (index, el) {
          $clamp(el, { clamp: 2 });
        });
    });
  });
});
