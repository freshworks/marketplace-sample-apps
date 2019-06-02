/**
 * @desc - Sample App shows fectching Contact from Data API and shows on Ticket
 * sidebar
 */

$(document).ready(function(){   
  (function(){
    app.initialized().then((_client)=>{
      window.client = _client;
      client.events.on('app.activated',()=>{
      getcontactdata();
      });
    });
    function getcontactdata(){
      client.data.get('contact').then((data)=>{
      $('#apptext').text(`Ticket created by ${data.contact.name}`);  
      congratulations();
      },(e)=>{
        console.log(`Found some error. More info: ${e}`);
      });
    }
    function congratulations(){
      $('.content').text(`Congratulations on creating your first app`);
    }
  })();
});