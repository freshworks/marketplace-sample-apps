$(document).ready( function() {
    app.initialized()
        .then(function(_client) {
          var client = _client;
          window.cl = _client;
          client.events.on('app.activated',
            function() {
                var path = '/',
                  headers = { Authorization: 'bearer <%= access_token %>'},
                  reqData = { headers: headers, isOAuth: true },
                  url = 'https://api.onedrive.com/v1.0/drive/root:' + path + ':/children';

              client.request.get(url, reqData)
              .then(function(data) {
                var response = JSON.parse(data.response)['value'];
                var html = '';
                if (response.length == 0) {
                  jQuery('#lfiles').find('#lfiles').append("<div class='alert alert-warning'>No files in your OneDrive.</div>");
                }
                else {
                  response.map(function(resp) {
                    console.log(resp);
                    if (resp.folder) {
                      html += '<div class="onedrive-div"><div class="onedrive-folder-icon"></div>';
                    } else {
                      html += '<div class="onedrive-div"><div class="onedrive-file-icon"></div>';
                    }
                    html += '<div class="onedrive-content">'+resp['name']+'</div></div><br style="clear:both;"/>';
                  });
                  jQuery('#lfiles').append(html);
                }
              }, function() {
                jQuery('#lfiles').append("<div class='alert alert-danger'>Error displaying files</div>");
              });
        });
    });
});
