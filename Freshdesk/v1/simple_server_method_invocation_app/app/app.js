(function() {
  'use strict';
  return {

    events: [
      {event: 'click', selector: '#submitCustomSMS', callback: 'notifySMS'}
    ],

    initialize: function() {
      //set the default value to the requester phone.
      var user = null;
      if(domHelper.ticket){
        user = domHelper.ticket.getContactInfo().user;
      }
      else if(domHelper.contact){
        user = domHelper.contact.getContactInfo().user;
      }
      var userPhone = user.mobile || user.phone;
      jQuery(this.$container).find("#customSMS #to").val(userPhone);
    },

    notifySMS: function(event) {
      var self = this;
      event.preventDefault();
      var form_obj = jQuery(this.$container).find("#customSMS");

      if(form_obj.valid()) {
        var req_phone = jQuery(this.$container).find('#to').val();
        var msgContent = jQuery(this.$container).find("#custom_msg").val();
        jQuery(this.$container).find("#submitCustomSMS").addClass('disabled');
        // using smi feature to send the sms.
        var options = { phone: req_phone, message: msgContent };
        self.$request.invoke('sendSMS', options)
          // on success callback.
          .done( function(data) {
            console.log(data);
            var html = "<p class='success'>Message sent successfully.</p>";
            self.handleResponse(html);            
          })
          // on failure callback.
          .fail( function(error) {
            error = JSON.parse(error.message);
            var html = "<p class='failure'>" + error.message + "</p>";
            self.handleResponse(html);
          });
      }
    },
    
    handleResponse: function(msg) {
      jQuery(this.$container).find(".message_status").html(msg);
      jQuery(this.$container).find('.message_status p').fadeOut(5000,'linear');
      jQuery(this.$container).find("#submitCustomSMS").removeClass('disabled');
    }

  };
})();

