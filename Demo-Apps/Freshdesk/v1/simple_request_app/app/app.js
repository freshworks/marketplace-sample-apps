(function() {
  "use strict";
  return {
    events: [
      { event: 'click', selector: '.request-btn', callback: 'makeRequest'},
    ],
    displayStatus: function(status, target, method) {
      var _this = this;
      var color;
      var message;
      if (status == "success") {
        color = "green";
        message = method.toUpperCase() + " request successfull";
      }
      else if (status == "error") {
        color = "red";
        message = method.toUpperCase() + " request failed";
      }
      jQuery(this.$container).find("#" + target).next().text(message);
      jQuery(this.$container).find("#" + target).next().css("color", color);
      setTimeout(function() {
        jQuery(_this.$container).find("#" + target).next().text("Click me");
        jQuery(_this.$container).find("#" + target).next().css("color", "grey");
      },2000);
    },
    makeRequest: function(e) {
      var target = e.target.id;
      var method = e.target.getAttribute("method");
      var url = this.baseUrl + method;
      var _this = this;
      var options = {
        "headers" : {
          "Content-Type": "application/json"
        }
      };
      this.$request[method](url, options)
      .done(function() {
        _this.displayStatus("success", target, method);
      })
      .fail(function() {
        _this.displayStatus("error", target, method);
      });
    },
    initialize: function() {
      this.baseUrl = "https://httpbin.org/";
    }
  };
})();
