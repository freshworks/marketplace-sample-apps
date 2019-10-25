function sendNotification(type, message) {
  client.instance.send({
    message: {
        type: 'showNotification',
        args: {type: type, message: message}
      }
  });
}

function generateUuid() {
  function S4() {
    return ((1+Math.random())*0x10000 | 0).toString(16).substring(1); 
  }

  return (S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4()).toLowerCase();
}

function validEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}