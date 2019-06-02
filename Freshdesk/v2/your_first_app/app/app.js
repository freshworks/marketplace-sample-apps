/**
 * @desc - Sample App shows fectching Contact from Data API and shows on Ticket
 * sidebar
 */

$(document).ready(function(){   
  app.initialized().then((_client)=>{
    window.client = _client;
    client.events.on('app.activated',()=>{
    console.log(`App activated`);
    getcontactdata();
    });
  });

  function getcontactdata(){
    console.log(`getting app data`);
    client.data.get('contact').then((data)=>{
    $('#apptext').text(`Ticket created by ${data.contact.name}`);  
    congratulations();
    },(e)=>{
      console.log('Exeception -',e);
    });
  }

  function congratulations(){
    $('.content').text(`Congratulations on creating your first app!`);
  }
});