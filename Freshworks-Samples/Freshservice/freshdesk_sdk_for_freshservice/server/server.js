var util = require('./lib/util');
const freshdesk = require('freshdesk-sdk');
const fd = new freshdesk({ domain: 'freshworksrelations941', api_key: 'xxxxxxxxxx' });
var urlConstants = {
  protocol: "https://",
  fs_domain_suffix: ".freshservice.com",
  ticket_url: "/api/v2/tickets/",
  ticket_status_url: "/api/v2/ticket_fields?type=default_status",
};
var dataConstants = {
  info: "info",
  error: "error",
  add_private_note_in_fd: "add_private_note_in_fd",
  note_prefix: "<div>Note Content: "
};

function getRequestApi(url, args, operation) {
  return new Promise((resolve, reject) => {
    $request.get(url, {
      headers: { 'Authorization': util.getFsAPIKey(args) }
    })
      .then(
        function (data) {
          resolve(data);
        },
        function (e) {
          reject(e);
        }
      );
  });
}

exports = {
  events: [
    { event: 'onTicketUpdate', callback: 'onTicketUpdateCallback' },
    { event: "onConversationCreate", callback: "onConversationCreateCallback" }
  ],

  onTicketUpdateCallback: function (args) {
    var tktSubject = args.data.ticket.subject;
    var regexStr = /^([[]{1}[#]{1}[F]{1}[D]{1}[-]{1}[0-9]+[\]]{1})/;
    var regex = new RegExp(regexStr);
    if (regex.test(tktSubject)) {
      var resultStr = tktSubject.match(regex)[1];
      var lastIndex = resultStr.lastIndexOf('-');
      var fdTktId = resultStr.substring(lastIndex + 1, resultStr.length - 1);
      console.log(parseInt(fdTktId));
      fdTicketId = parseInt(fdTktId);
      if (args.data.ticket.changes.status) {
        var fsBaseURL = urlConstants.protocol + args.iparams.fs_subdomain + urlConstants.fs_domain_suffix;
        if (args.iparams.fs_status_updated == dataConstants.add_private_note_in_fd) {
          var fsGetTktStatusFieldURL = fsBaseURL + urlConstants.ticket_status_url;
          getRequestApi(fsGetTktStatusFieldURL, args, 'Freshservice status details fetch')
            .then(fsTktStatusData => {
              var statusDetails = JSON.parse(fsTktStatusData.response).ticket_fields[0];
              var statusChoices = statusDetails.choices;
              var oldStatus = statusChoices[args.data.ticket.changes.status[0]][0];
              var newStatus = statusChoices[args.data.ticket.changes.status[1]][0];
              var msg = `<div>Note Content: <div>Status has been updated from ${oldStatus} to ${newStatus}</div></div>`;
              fd.tickets.addNotes( fdTicketId, { body: msg} ).then(function (data) {
                console.log('Ticket notes successfull');
                console.log(data);
              }).catch(function (error) {
                console.log('Ticket notes error');
                console.log(error);
              });
            })
            .catch(e => {
            });
        } 
      }
    }
  },

  onConversationCreateCallback: function (args) {
    if (args.iparams.fs_note_added == dataConstants.add_private_note_in_fd &&
      !args.data.conversation.body.startsWith(dataConstants.note_prefix)) {

      var fsBaseURL = urlConstants.protocol + args.iparams.fs_subdomain + urlConstants.fs_domain_suffix;
      var ticketId = args.data.conversation.ticket_id;
      var getFsTktURL = fsBaseURL + urlConstants.ticket_url + ticketId;
      getRequestApi(getFsTktURL, args, "Fetch FS Ticket details")
        .then(fsTktData => {
          var fsTktDetails = fsTktData.response;
          var tktSubject = JSON.parse(fsTktDetails).ticket.subject;
          var regexStr = /^([[]{1}[#]{1}[F]{1}[D]{1}[-]{1}[0-9]+[\]]{1})/;
          var regex = new RegExp(regexStr);
          if (regex.test(tktSubject)) {
            var resultStr = tktSubject.match(regex)[1];
            var lastIndex = resultStr.lastIndexOf('-');
            var fdTktId = resultStr.substring(lastIndex + 1, resultStr.length - 1);
            var msg = `<div>${args.data.conversation.body}</div>`;
            fd.tickets.addNotes( parseInt(fdTktId), { body: msg} ).then(function (data) {
              console.log('Ticket notes successfull');
              console.log(data);
            }).catch(function (error) {
              console.log('Ticket notes error');
              console.log(error);
            });
          }
        })
        .catch(e => {
          console.log(`Error while fetching freshservice ticket - ${e}`);
        });

    }
  }

};