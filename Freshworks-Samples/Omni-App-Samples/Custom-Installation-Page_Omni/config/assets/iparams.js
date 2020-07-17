let client;

function onDocumentReady() {
  app
    .initialized()
    .then(function (_client) {
      client = _client;
      productSpecificPage();
    })
    .catch((err) => {
      logError(err);
    });
}

function productSpecificPage() {
  let productName = client.context.product;
  console.log(productName);
  document.querySelector('')
}

function logError(err) {
  console.log("Execption error -", err);
}

$(document).ready(onDocumentReady);
