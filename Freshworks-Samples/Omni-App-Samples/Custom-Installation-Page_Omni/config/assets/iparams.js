let client;

const titleHTML = document.querySelector("header.product-specific.title");
const subTitleHTML = document.querySelector("legend.product-specific.subtitle");

function onDocumentReady() {
  app
    .initialized()
    .then(function (_client) {
      client = _client;
      let productName =
        String(client.context.product) == "freshsales" // This line tends to change. Pending on production changes.
          ? "Freshsales"
          : "Freshworks CRM";
      productSpecificPage(productName);
    })
    .catch(function logError(err) {
      console.error("Some error occurred -", err);
    });
}

function productSpecificPage(productName) {
  titleHTML.innerHTML = `Omni - Custom Installation Page: <span>
  ${productName}</span > 🌍`;
  subTitleHTML.innerHTML = `${productName} Specific Elements
        Implementation`;
}

$(document).ready(onDocumentReady);
