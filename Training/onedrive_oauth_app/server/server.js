exports = {

  events: [
    { event: 'onTicketCreate', callback: 'onTicketCreateHandler' }
  ],

  onTicketCreateHandler: function(args) {
    $request.get('https://api.onedrive.com/v1.0/drive/root:/:/children', {
      headers: {
        Authorization: 'bearer <%= access_token %>'
      },
      isOAuth: true
    })
    .then(function(data) {
      var files = JSON.parse(data.response).value;
      files.forEach(function(file) {
        console.log(file.name);
      });
    }, function(err) {
      console.log(err);
    });
  }

};
