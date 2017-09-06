(function() {
  "use strict";
  return {
    initialize: function() {
      console.log("My First App!");
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

/*
{%comment%}

## Help: Using iparam (​installation parameters) in code

iparam: The ​settings that you want your users to configure when installing the
app.

iparam definition is made in config/iparam_en.yml file. To use the defined
iparam in code, use Liquid notation like:

- {{iparam.username}}
- {{iparam.country}}

{%endcomment%}
*/
