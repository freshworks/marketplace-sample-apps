(function() {
  "use strict";
  return {
    initialize: function() {
      var email = domHelper.ticket.getContactInfo().user.email;
      var html = '<div class="g-hangout" data-render="createhangout" data-invites="[{"id": ' + email + ',"invite_type": "EMAIL"}]"></div>';
      appPlaceholder.ticket.requestorInfo(jQuery(this.$container));
      jQuery(this.$container).find('.google-hangout').html(html);
    }
  };
})();
