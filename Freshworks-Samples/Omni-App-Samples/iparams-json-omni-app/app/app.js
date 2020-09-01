let client, result;

function init() {
  result = document.getElementById('result');
  app.initialized().then(
    function (_client) {
      client = _client;
      client.events.on('app.activated', data_method());
    },
    (err) => {
      errorHandler(err);
    },
  );
}

function data_method() {
  client.data.get('domainName').then(
    (data) => {
      console.log(data, result);
    },
    (error) => {
      errorHandler(err);
    },
  );
}

function errorHandler(err) {
  console.error('Some unfortunate error occured -', err);
}

$(document).ready(init);
