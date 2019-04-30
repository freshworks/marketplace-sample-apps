/**
 * @description - 
 * 
 * This app uses a Custom Installation page to get input from the user through
 * a color picker from element. It also dynamically populates a drop down field
 * by making an API call.
 * 
 * These values are then used in the ticket details page to render the drop down
 * field value in the selected background color.
 * 
 *  */
$(document).ready(() => {
  app.initialized().then(function(_client) {
    window.client=_client;
    client.events.on('app.activated',() => {
      client.iparams.get('bgColour').then((data) => {
        $('body').css('background-color',data.bgColour);
      });
      client.iparams.get('book').then((data) => {
        $('#apptext').html(`Your book is <br> ${data.book}`);
      });
      
    });
  });
});
