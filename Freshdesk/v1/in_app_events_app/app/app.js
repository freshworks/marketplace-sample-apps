(function() {
  "use strict";
  return {
    events: [
      {event:'click', selector:'#click-button', callback: 'clickButton'},
      {event:'change', selector:'#color-select', callback: 'colorSelect'}
    ],
    initialize: function() {
      this.count = 1;
    },
    clickButton: function() {
      jQuery(this.$container).find("#count").text("Count " + this.count);
      this.count += 1;
    },
    colorSelect: function() {
      jQuery(this.$container).find("#option-color").text(jQuery("#color-select").val());
      jQuery(this.$container).find("#option-color").toggleClass("Red");
      jQuery(this.$container).find("#option-color").toggleClass("Blue");
    }
  };
})();
