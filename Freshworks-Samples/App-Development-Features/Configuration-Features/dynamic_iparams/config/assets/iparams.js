/* global app,client, utils */

/**
 * App lifecycle method to initialize the app and to obtain the `client` object
 * More details on Dynamic Installation parameters can be found at the link below ⬇️
 * https://developers.freshdesk.com/v2/docs/installation-parameters/#dynamic_install_page
 */
app.initialized().then(
  function (_client) {
    //If successful, register the app activated and deactivated event callback.
    window.client = _client;
  },
  function (error) {
    //If unsuccessful
    console.error(error);
  }
);

/**
 * Using this iparam callback function, we are validating the details using a third-party API. 
 * In this case,for example, we are making use of `httpbin.org` to return 200 OK status. 
 * In real-world, this could be a valid third-party API that can return an appropriate status code indicating the status of validation
 * Payload and other options can be specified using `options`
 * 
 * @param {string} newValue The new value of the iparam field
 */
function checkAccountID(newValue) {
  //Validate
  if (!isNaN(newValue))
    return Promise.reject("Account ID has to be a string");
  //Verify account ID
  var url = "https://httpbin.org/status/200";
  var options = {
    body: JSON.stringify({
      param: newValue
    })
  };
  var p = new Promise(function (resolve, reject) {
    client.request.post(url, options).then(
      function (data) {
        // Upon success
        resolve();
      },
      function (error) {
        // Upon failure - send an appropriate validation error message
        reject("This Account ID does not exist. Please enter the right one");
      }
    );
  });
  return Promise.resolve();
}
/**
 * When the contact method changes, just display the options
 * To set the list of possible options to choose from, use -> utils.set("<iparam_field>", { values: ['Opt1', 'Opt2', 'Opt3'] });
 */
function contactMethodChanged() {
  //Let us get the selected options for contact methods
  const cm = utils.get("contact_methods");
  console.log(cm);
}