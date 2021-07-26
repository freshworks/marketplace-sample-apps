/**
 * Voucher Dialog
 */
document.addEventListener('DOMContentLoaded', function () {
  app
    .initialized()
    .then(onAppInitializedCallback)
    .catch(function (error) {
      //Log and notify initialization error
      console.error(error);
      showNotification('danger', 'Unable to initialize the app');
    });
});

/**
 * Call the voucher API and render the view based on the response
 * @param {*} _client
 */
function onAppInitializedCallback(_client) {
  window.client = _client;
  client.instance.resize({ height: '500px' });
  client.iparams.get('voucher_api').then(function (iparam) {
    client.request
      .get(
        `https://${iparam.voucher_api}/hemchander23/d762eaa5beab373218bb61ae6294afda/raw/dummyVoucherData.json`,
        {}
      )
      .then(function (data) {
        // If we successfully get the voucher data, we can proceed to showing that in the UI
        renderVoucherView(data.response);
      })
      .catch(function (error) {
        //Log and notify the agent/user
        console.error(error);
        showNotification('danger', 'Unable to get voucher data');
        client.instance.close();
      });
    //Register the click handler for a voucher item
    document.querySelector('fc_voucher').addEventListener('click', voucherClickHandler);
  })
}

/**
 * Renders the voucher list upon clicking the voucher icon in the conversation message editor area
 * @param {*} data
 */
function renderVoucherView(data) {
  try {
    var template = document.getElementById('voucher_list').innerHTML;
    var templateScript = Handlebars.compile(template);
    var voucherData = JSON.parse(data);
    document.getElementById('vouchers').innerHTML = templateScript(voucherData);
  } catch (e) {
    //Log and notify the agent/user
    console.error(e);
    showNotification('danger', 'Unable to render voucher view');
    client.instance.close();
  }
}

/**
 * Handles clicking the voucher. Gets the voucher details and appends it to the message editor automatically
 * @param {*} e
 */
function voucherClickHandler(e) {
  var voucher = e.target;
  var voucher_name = voucher.data('vouchertitle') || 'N.A';
  var voucher_desc = voucher.data('voucherdesc') || 'N.A';
  //Use Interface APIs to set the editor value
  var voucher_message = `Voucher Code :  ${voucher_name}  - ${voucher_desc}`;
  client.interface
    .trigger('setValue', { id: 'editor', value: voucher_message })
    .then(function () {
      client.instance.close();
    })
    .catch(function (error) {
      console.error('Error occured while setting editor value', error);
      client.instance.close();
    });
}

/**
 * Shows notification to the agent
 * @param {string} type
 * @param {string} message
 */
function showNotification(type, message) {
  client.interface.trigger('showNotify', {
    type: type || 'alert',
    message: message || 'NA'
  });
}
