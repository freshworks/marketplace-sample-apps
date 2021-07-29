var currentProduct;
var client;

var makeIpageSales = function () {
  utils.set("apiKey", { label: "Freshsales API Key" });
  utils.set("apiKey", { hint: "Enter Freshsales API key" });
};

var makeIpageFcrm = function () {
  utils.set("apiKey", { label: "Freshworks CRM API Key" });
  utils.set("apiKey", { hint: "Enter Fresworks CRM API key" });
};

function APIKeyChange(enteredApiKey) {
  let value;
  let options = {
    Authorization: `Token token=${enteredApiKey}`,
    "Content-Type": "application/json",
  };
  let productUrl =
    client.context.productContext
      .url; /** Freshsales - https://subdoamin.freshsales.io Freshworks CRM - http://subdomain.myfreshworks.com/crm */
  let url =
    client.context.productContext.name == "freshsales"
      ? productUrl
      : `${productUrl}/sales`;
  url = `${url}/api/leads/9000146122`;
  client.request.get(url, options).then(
    function (data) {
      console.log(`On Authenticating: ${data}`);
      value = data.status;
    },
    function (error) {
      console.log(error.status);
      value = error.status;
    }
  );
  return value == 200 ? "Valid API Key" : "InValid API key";
}

function onFormLoad() {
  app.initialized().then(function getClientObj(_client) {
    client = _client;
    currentProduct = client.context.productContext.name;
    if (currentProduct == "freshsales") {
      makeIpageSales();
    } else if (currentProduct == "freshworks_crm") {
      makeIpageFcrm();
    } else {
      console.error("🚒 Not able to obtain the current product context");
    }
  });
}
