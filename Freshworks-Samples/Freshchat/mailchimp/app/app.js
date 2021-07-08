/**
 * Mailchimp Sample App for Freshchat
 * When the 'email' for a user is added/updated, you can directly add them to Mailchimp from Freshchat
 * For further details, refer README
 *
 * Note: Assigning client object to window.client or to a global variable is only allowed in the front-end. Using the same approach in the serverless apps is discouraged.
 */
document.addEventListener("DOMContentLoaded", function () {
  app.initialized()
    .then(function (_client) {
      window.client = _client;
      client.events.on('user.onSaveEmailClick', onSaveEmailClickHandler);
    })
    .catch(function (error) {
      //Log and notify initialization error
      console.error(error);
      showNotification("danger", "Unable to initialize the app");
    });
});

/**
 * Handles the onSaveEmailClick event - which is triggered when a new email is added or when the existing email is updated
 * @param {*} event
 */
function onSaveEmailClickHandler(event) {
  //Get the email ID
  var email = event.helper.getData();
  //Show confirmation dialog to add mailchimp subscriber - remember it timesout after 10 seconds
  client.interface.trigger("showConfirm", {
    title: "New Subscriber 🎉",
    message: "Do you wish to add the current user to the mailchimp subscriber list?",
    saveLabel: "Add",
    cancelLabel: "Skip"
  }).then(function (result) {
    if (result.success) {
      //The Agent has chosen to add the current user else it means the user chose 'Skip'
      createMailchimpSubscriber(email);
    }
  }).catch(function (error) {
    //If the timeout exceeds
    console.error(error);
    showNotification("warning", "Confirmation not done within the timeout period. Skip and retry");
  });
};

/**
 * Creates a mailchimp subscriber with the given email and the current user details
 * @param {*} email
 */
function createMailchimpSubscriber(email) {
  //Get the current user details. Use Function.prototype.bind() to pass paramters to the success callback fn.
  client.data.get('user')
    .then(prepareMailchimpCall.bind(null, email))
    .catch(function (e) {
      //Something went wrong while fetching user data / while attempting to call mailchimp
      console.error(e);
      showNotification("danger", "Failed to get user details. Refer console for detailed logs");
    });
}

/**
 * Prepare the request body and headers for the Mailchimp API call
 * @param {*} email
 * @param {*} data
 */
function prepareMailchimpCall(email, data) {
  //Prepare the body for Mailchimp API call
  var requestBody = {
    "email_address": email,
    "status": "unsubscribed",
    "merge_fields": {
      "FNAME": data.user.first_name || "NA",
      "LNAME": data.user.last_name || "NA"
    }
  };
  //Prepare the headers for Mailchimp API call
  var requestHeaders = {
    "Authorization": "Basic <%= iparam.mailchimp_key %>",
    "Content-Type": "application/json",
    "Accept": "*/*"
  };
  callMailchimpAPI(requestHeaders, requestBody);
}

/**
 * Calls mailchimp REST API. Makes use of iparams to construct the request URL
 * @param {*} requestHeaders
 * @param {*} requestBody
 */
function callMailchimpAPI(requestHeaders, requestBody) {
  //Options paramter for mailchimp API call
  var options = { headers: requestHeaders, body: JSON.stringify(requestBody) };
  client.iparams.get().then(function (iparam) {
    var url = `https://${iparam.mailchimp_host}/3.0/lists/${iparam.mailchimp_audience_id}/members/`;
    // Make the API call to mailchimp
    client.request.post(url, options)
      .then(handleSubscriberCreation)
      .catch(function (error) {
        //Adding subscriber failed - Log and Notify
        console.error(error);
        showNotification("danger", "Failed to create subscriber.Check console for detailed error");
      });
  })
}

/**
 * Handles the success callback of Mailchimp API call
 * @param {*} data
 */
function handleSubscriberCreation(data) {
  if (data.status === 200) {
    //Subscriber successfully added
    showNotification("success", "Subscriber added successfully.");
  } else {
    //Log and notify if the response is unexpected
    console.info(data);
    showNotification("warning", "Unable to confirm the status of subscriber creation. Check console for further details");
  }
}

/**
 * Shows notification to the agent
 * @param {string} type
 * @param {string} message
 */
function showNotification(type, message) {
  client.interface.trigger("showNotify", {
    type: type || "alert",
    message: message || "NA"
  });
}
