var client;

isDocumentReady();

function startAppRender() {
  app
    .initialized()
    .then(function loadContactData(_client) {
      client = _client;
      client.events.on('app.activated', renderContactName);
    })
    .catch(errorHandler);
}

function renderContactName() {
  var textElement = document.getElementById('apptext');
  client.data
    .get('contact')
    .then(function getData(data) {
      textElement.innerHTML = `Ticket created by ${data.contact.name}`;
    })
    .catch(errorHandler);
}

function appLoading() {
  console.info('There is an error in rendering the app!');
}

function errorHandler(err) {
  console.error(`App failed to initialize because...`);
  console.error(err);
}

function isDocumentReady() {
  if (document.readyState != 'loading') appLoading();
  else document.addEventListener('DOMContentLoaded', startAppRender);
}
