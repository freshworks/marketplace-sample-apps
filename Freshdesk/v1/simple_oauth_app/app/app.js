(function() {
  'use strict';
  return {
    initialize: function() {
      var self = this,
          path = '/',
          headers = { Authorization: 'bearer <%= access_token %>'},
          reqData = { headers: headers, isOAuth: true },
          url = 'https://api.onedrive.com/v1.0/drive/root:' + path + ':/children';

      this.$request.get(url, reqData)
      .done(function(data) {
        var response = JSON.parse(data.response)['value'];
        var html = '';
        if (response.length == 0) {
          jQuery(self.$container).find('#lfiles').append("<div class='alert alert-warning flash-box'>No files in your One Drive.</div>");
        }
        else {
          response.map(function(resp) {
            if (resp.folder) {
              html += '<div class="onedrive-div"><div class="onedrive-folder-icon"></div>';
            } else {
              html += '<div class="onedrive-div"><div class="onedrive-file-icon"></div>';
            }
            html += '<div class="onedrive-content">'+resp['name']+'</div></div><br style="clear:both;"/>';
          });
          jQuery(self.$container).find('#lfiles').append(html);
        }
      })
      .fail(function() {
        jQuery(self.$container).find('#lfiles').append("<div class='alert alert-danger flash-box'>Error displaying files</div>");
      });
    }
  };
})();
