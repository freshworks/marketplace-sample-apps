window.frsh_init().then(function(client) {
  window.client = client;
  // Instance APIs
  // resize the instance
  client.instance.resize({ height: "200px" });

  // current instance details
  client.instance.context().then(function(context){

    // receive message from other instances
    client.instance.receive(function(e){
      let data = e.helper.getData();
      console.log(`${context.instance_id}: Received message from ${JSON.stringify(data.sender)}: Message: `, data.message);
    });

    console.log('instance API context', context);
  });
});

function showModal() {
  client.interface.trigger('showModal', {
    title: 'Sample App Form',
    template: 'modal.html',
    data: {
      defaultName: 'test',
      defaultEmail: 'test@email.com'
    } })
  .then( 
    function(data) {
      console.log('Parent:InterfaceAPI:showModal', data);
    },
    function(error) {
      console.log('Parent:InterfaceAPI:showModal', error);
    }
  );
}

function showDialog() {
  client.interface.trigger('showDialog', {
    title: 'Sample Dialog',
    template: 'modal.html',
    data: {
      defaultName: 'test',
      defaultEmail: 'test@email.com'
    } })
  .then(
    function(data) {
      console.log('Parent:InterfaceAPI:showDialog', data);
    },
    function(error) {
      console.log('Parent:InterfaceAPI:showDialog', error);
    }
  );
}
