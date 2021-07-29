exports = {
  onLeadCreateHandler: function (payloadFromFsales) {
    console.log(
      `Getting payload from Freshsales when Lead is created: ✏️ ${payloadFromFsales.productContext.name}`
    );
  },
  onContactCreateHandler: function (payloadFromCRM) {
    console.log(
      `Getting payload when Contact is created in Freshworks CRM: ${payloadFromCRM.productContext.name}`
    );
  },
  commonOnDealCreateHandler: function (payloadInProductRuntime) {
    console.log(
      `Example of code that can be common in both the products🤹🏼‍♂️:${payloadInProductRuntime.productContext}`
    );
  },
  freshsalesOnExternalEvent: function (payloadFromSales) {
    console.log(
      `Example of code executed within Freshsales when External Event happens: ${payloadFromSales.productContext}`
    );
  },
  fcrmOnExternalEventHandler: function (payloadFromCRM) {
    console.log(
      `Example of code executed within Freshworks CRM when External Event happens: ${payloadFromSales.productContext}`
    );
  },
};
