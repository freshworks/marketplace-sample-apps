window.frsh_init().then(function(client) {
  window.client = client;
});

function showModal() {
  client.interface.trigger('showModal', {
    title: 'Sample App Form',
    template: 'modal.html' })
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
    template: 'modal.html' })
  .then(
    function(data) {
      console.log('Parent:InterfaceAPI:showDialog', data);
    },
    function(error) {
      console.log('Parent:InterfaceAPI:showDialog', error);
    }
  );
}

function showConfirm() {
  client.interface.trigger('showConfirm', {
    title: 'Sample Confirm',
    message: 'Select OK or Cancel'
  })
  .then( 
    function(data) {
      console.log('Parent:InterfaceAPI:showConfirm', data);
    },
    function(error) {
      console.log('Parent:InterfaceAPI:showConfirm', error);
    }
  );
}

function notify() {
  client.interface.trigger('showNotify', {
    type: 'success', message: 'success message'})
  .then( 
    function(data) {
      console.log('Parent:InterfaceAPI:showNotify', data);
    },
    function(error) {
      console.log('Parent:InterfaceAPI:showNotify', error);
    }
  );
}

function hide(element) {
  client.interface.trigger("hide", { id: element });
}

function show(element) {
  client.interface.trigger("show", { id: element });
}

function enable(element) {
  client.interface.trigger("enable", { id: element });
}

function disable(element) {
  client.interface.trigger("disable", { id: element });
}

function setValue(element, value) {
  client.interface.trigger("setValue", { id: element, value: value });
}

function openNote(element) {
  client.interface.trigger("click", {id: "note", text: "Text to be inserted", isPublic: true});
}

function insertContent(element) {
  client.interface.trigger("setValue", {id: "editor", text: "insert content"} );
  // Replace content
  // client.interface.trigger("setValue", {id: "editor", text: "replace content", replace: true} );

  // position end
  // client.interface.trigger("setValue", {id: "editor", text: "insert content at the end", replace: false, position: 'end'} );
}