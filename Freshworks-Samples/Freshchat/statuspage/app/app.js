/**
 * Statuspage sample app for Freshchat
 * Shows the component-level status of the Statuspage that we intend to monitor from Freshchat
 *
 * Note: Assigning client object to window.client or to a global variable is only allowed in the front-end. Using the same approach in the serverless apps is discouraged.
 */
document.addEventListener('DOMContentLoaded', function () {
  app.initialized().then(onAppInitializedCallback, function (error) {
    //Log and notify initialization error
    console.error(error);
    showNotification('danger', 'Unable to initialize the app');
  });
});
/**
 * Prepare the Stauspage API URL, request headers using templating -  'status_page_api_key' is a secure iparam &  'status_page_host' is a normal iparam
 * Poll Statuspage based on 'status_page_poll_frequency' and get the component status
 * @param {Object} _client
 */
function onAppInitializedCallback(_client) {
  window.client = _client;
  var requestHeaders = { Authorization: 'OAuth <%= iparam.status_page_api_key %>' };
  var options = { headers: requestHeaders };
  var url = '';
  client.iparams.get().then(
    function (data) {
      url = `https://${data.status_page_host}/api/v2/summary.json`
      checkStatus(url, options);
      setInterval(checkStatus, parseInt(data.status_page_poll_frequency) * 1000, url, options);
    },
    function (error) {
      //Log and Notify the user if there's an issue while obtaining the poll frequency
      console.error(error);
      showNotification('danger', 'Unable to obtain the poll frequency');
    }
  );
}

/**
 * Poll statuspage every 'n' seconds using Request API -
 * @param {string} url
 * @param {Object} options
 */
function checkStatus(url, options) {
  client.request
    .get(url, options)
    .then(function (data) {
      if (data.response) {
        displayStatus(data.response);
      } else {
        console.warn('No response.');
        showNotification('warning', 'No response from Statuspage');
      }
    })
    .catch(function (error) {
      //Log and Notify the user if Request API call fails
      console.error(error);
      showNotification('danger', 'Request to Statuspage failed. Please check the console for error messages');
    });
}

/**
 * Render the component status view based on the data
 * @param {Object} apiResponse - The JSON response from the status page APIs
 */
function displayStatus(apiResponse) {
  //try..catch.. is used to handle synchronous errors.
  try {
    var responseData = JSON.parse(apiResponse);
    var template = document.getElementById('status_template').innerHTML;
    var templateScript = Handlebars.compile(template);
    var context = responseData;
    document.getElementById('status_info').innerHTML = templateScript(context);
  } catch (e) {
    //Log and Notify the user if there's an error
    console.error(e);
    showNotification('danger', 'Error occured while showing the component status');
  }
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
