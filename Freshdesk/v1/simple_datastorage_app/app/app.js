(function() {
  "use strict";
  return {
    events: [
      { event: 'click', selector: '#note-save', callback: 'saveNote'},
      { event: 'click', selector: '#note-delete', callback: 'deleteNote'}
    ],
    showFlash: function(status, msg) {
      var html = "";
      if (status == "success") {
        html = "<div class='alert alert-success flash-box'>" + msg + "</div>";
      }
      else if (status == "error") {
        html = "<div class='alert alert-danger flash-box'>" + msg + "</div>";
      }
      jQuery(this.$container).find("#alert-box").html(html);
    },
    saveNote: function() {
      var _this = this;
      var note = jQuery(this.$container).find('#note').val();
      if (note == "") {
        _this.showFlash("error", "No data to store.");
        return;
      }
      this.$db.set(this.key, { "note" : note})
      .done(function() {
        _this.showFlash("success", "Stored successfully.");
      })
      .fail(function() {
        _this.showFlash("error", "Error storing.");
      });
    },
    deleteNote: function() {
      var _this = this;
      this.$db.delete(this.key)
      .done(function() {
        jQuery(_this.$container).find("#note").val("");
        _this.showFlash("success", "Deleted successfully.");
      })
      .fail(function() {
        _this.showFlash("error", "Error Deleting.");
      });
    },
    displayNote: function() {
      var _this = this;
      this.$db.get(this.key)
      .done(function(data) {
        jQuery(_this.$container).find("#note").val(data.note);
      })
      .fail(function() {
      });
    },
    initialize: function() {
      if (page_type == 'ticket') {
        this.key = current_user.user.id + ":" + domHelper.ticket.getTicketInfo().helpdesk_ticket.id;
      }
      else if (page_type == 'contact') {
        this.key = current_user.user.id + ":" + domHelper.contact.getContactInfo().user.id;
      }
      this.displayNote();
    }
  };
})();
