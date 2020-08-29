function onFormLoad() {
  console.log(
    'Onformload callback function is called when iparam page is opened',
  );
  app.initialized().then(
    function (client) {
      // let product = client.context.product;
      let product = client.context.productContext.name;

      if (product == 'freshsales') {
        //Changing Hint Text Based on Product
        utils.set('ApiKey', {hint: 'Enter APIKey of your Freshsales Account'});
        utils.set('TextDomain', {
          hint: 'Enter Full Domain of your Freshsales Account',
        });
        //Changing Display Name Based on Product
        utils.set('ApiKey', {label: 'APIKey_Freshsales'});
        utils.set('TextDomain', {label: 'FullDomain_Freshsales'});
        //To Hidden the field specific to FCMR
        utils.set('FieldToDisplayInFCRM', {visible: false});
      } else if (product == 'freshworks_crm') {
        //Changing Hint Text Based on Product
        utils.set('ApiKey', {hint: 'Enter APIKey of your FCRM Account'});
        utils.set('TextDomain', {
          hint: 'Enter Full Domain of your FCRM Account',
        });
        //Changing Display Name Based on Product
        utils.set('ApiKey', {label: 'APIKey_FCRM'});
        //To Hidden the field specific to Fslaes
        utils.set('FieldToDisplayInFSales', {visible: false});
      } else {
        console.log('ERROR:Missing Expected product from client');
      }
    },
    function (error) {
      //If unsuccessful
      console.log('ERROR:Problem in fetching product from client');
    },
  );
}

function onFormUnload() {
  console.log('OnformUnload callback called');
}
