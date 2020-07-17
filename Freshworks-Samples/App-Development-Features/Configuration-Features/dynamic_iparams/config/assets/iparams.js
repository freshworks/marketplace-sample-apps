/* global app,client, utils */
var timeout;
/**
 * App lifecycle method to initialize the app and to obtain the `client` object
 * More details on Dynamic Installation parameters can be found at the link below ⬇️
 * https://developers.freshdesk.com/v2/docs/installation-parameters/#dynamic_install_page
 */
app.initialized().then(
  function (_client) {
    window.client = _client;
  },
  function (error) {
    //If unsuccessful
    console.error(error);
  }
);

/**
 * Using this iparam callback function, we are validating the details using a third-party API
 *  
 * @param {string} newValue The new value of the iparam field
 */
function checkAccountID(newValue) {
  // Input type validation
  if (!isNaN(newValue)) {
    return Promise.reject("Account ID has to be a string");
  }
  // Validation will be performed based on the value
  // A promise will be returned indicating the status of validation
  return validateWithAPI(newValue);
}
/**
 * In this case,for example, we are making use of `httpbin.org` to return 200 OK status. 
 * In real-world, this could be a valid third-party API that can return an appropriate status code indicating the status of validation
 * Payload and other options can be specified using `options`
 * Notice the presence of the debounce logic to avoid rate-limiting issues
 * 
 * @param {string} value 
 */
function validateWithAPI(value) {
  //Assume it is the validation/resource endpoint
  var url = "https://httpbin.org/status/200";
  var options = {
    body: JSON.stringify({
      param: value
    })
  };
  var p = new Promise(function (resolve, reject) {
    // Do not hit the validation API immediately upon change
    // Wait for 500ms and if the user hasn't typed anything during that time, make a call
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      client.request.post(url, options).then(
        function (data) {
          // Upon success, just resolve
          resolve();
        },
        function (error) {
          // Upon failure - send an appropriate validation error message
          reject("This Account ID does not exist. Please enter the right one");
        }
      );
    }, 500);
  });
  return p;
}
/**
 * When the contact method changes, just display the options
 * To set the list of possible options to choose from, use -> utils.set("<iparam_field>", { values: ['Opt1', 'Opt2', 'Opt3'] });
 */
function contactMethodChanged() {
  //Let us get the selected options for contact methods
  const cm = utils.get("contact_methods");
  console.info(cm);
}