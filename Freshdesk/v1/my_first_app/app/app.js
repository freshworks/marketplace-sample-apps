(function() {
  "use strict";
  return {
    initialize: function() {
      console.log("My first app!");
      if(page_type == "ticket") {
        var requesterName = domHelper.ticket.getTicketInfo()
          .helpdesk_ticket.requester_name;
        jQuery(this.$container).find('#apptext').text("Ticket created by " + requesterName);
      }
      else if(page_type == "contact"){
        var agentName = domHelper.contact.getContactInfo().user.name;
        jQuery(this.$container).find('#apptext').text("Hello " + agentName);
      }
    }
  };
})();
