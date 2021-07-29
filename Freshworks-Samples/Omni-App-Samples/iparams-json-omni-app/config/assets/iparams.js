var runtimeProductName;
var fsalesInstallationPage = function (utils) {
  utils.set("ApiKey", { hint: "Enter APIKey of your Freshsales Account" });
  t;
  utils.set("ApiKey", { label: "APIKey_Freshsales" });
  utils.set("FieldToDisplayInFCRM", { visible: false });
};
var fcrmInstallationPage = function (utils) {
  utils.set("ApiKey", { hint: "Enter APIKey of your FCRM Account" });
  utils.set("ApiKey", { label: "APIKey_FCRM" });
  utils.set("FieldToDisplayInFSales", { visible: false });
};

function onFormLoad() {
  console.log("OnFormLoad() function fired 🧨");
  app.initialized().then(
    function getClientObj(client) {
      runtimeProductName = client.context.productContext.name;

      /**
       * App trying to learn which product it's runtime is going to be on
       * render relavant installation page.
       */

      if (runtimeProductName == "freshsales") {
        fsalesInstallationPage(utils);
      } else if (runtimeProductName == "freshworks_crm") {
        fcrmInstallationPage(utils);
      } else {
        console.log("❗️:Missing Expected product from client");
      }
    },
    function onFailProductIdentification(error) {
      console.error("ERROR:Problem in fetching product from client");
    }
  );
}

function onFormUnload() {
  console.log("OnFormUnload function fired 🚒");
}
