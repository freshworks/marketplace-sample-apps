$(document).ready(function() {
  app.initialized().then(function(_client) {

    window.client=_client;
    client.events.on('app.activated',function() {

      client.iparams.get('bgColour').then(function(data) {
        $('body').css('background-color',data.bgColour);
      });
      client.iparams.get('book').then(function(data) {
        $('#apptext').html(`Your book is <br> ${data.book}`);
      });
      
    });
  });
});
