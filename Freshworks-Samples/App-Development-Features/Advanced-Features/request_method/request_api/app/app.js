isDocumentReady();

function startApprender() {
  app.initialized().then(function getClientObj(client) {
    let options = { client: true }
    const displayElement = document.getElementById('apptext');
    client.request.get("https://httpbin.org/get", options).then((payload) => {
      displayElement.innerHTML = `httpbin responded with <code>${payload.response}</code>`
    }, (error) => {
      console.error('An error occurred during the request..')
      console.error(error);
    })
  })
}

function isDocumentReady() {
  if (document.readyState != 'loading') {
    console.info('Browser waiting until DOM loads...')
  } else {
    document.addEventListener('DOMContentLoaded', startApprender);
  }
}