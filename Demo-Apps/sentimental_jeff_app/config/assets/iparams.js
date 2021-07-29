app.initialized().then(
  (client) => {
    window.client = client;
    utils.set("sentimentField", { disabled: true });
    fillTicketFieldsOptions();
  },
  (error) => {
    console.error("Error: Failed to init the app.");
    console.error(error);
  }
);

function fillTicketFieldsOptions() {
  let timeout;
  return new Promise(function (resolve, reject) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      client.iparams.get().then((iparams) => {
        const domain = utils.get("domainName") || iparams.domainName;
        const apiKey = utils.get("apiKey") || iparams.apiKey;
        if (domain && apiKey) {
          var url = `https://${domain}.freshdesk.com/api/v2/ticket_fields`;
          var options = {
            headers: {
              Authorization: "Basic " + btoa(apiKey + ":X"),
            },
          };
          client.request.get(url, options).then(
            function (data) {
              const ticketFields = JSON.parse(data.response);
              const customFields = ticketFields
                .filter((field) => field.type === "custom_text")
                .map((filteredField) => filteredField.name);
              if (customFields.length) {
                utils.set("sentimentField", { disabled: false });
                utils.set("sentimentField", { values: customFields });
              } else {
                console.info(
                  "Create a custom text field to update the sentiment result of the ticket to the ticket field."
                );
                client.interface.trigger("showNotify", {
                  type: "info",
                  message:
                    "To store the sentiment result in a ticket field, create a custom text field to configure here.",
                });
              }
              resolve();
            },
            function (error) {
              console.error("error");
              console.error(error);
              reject("Error: Cannot fetch ticket fields.");
            }
          );
        } else {
          console.info("skipped due to empty domain or api key");
          resolve();
        }
      });
    }, 500);
  });
}
