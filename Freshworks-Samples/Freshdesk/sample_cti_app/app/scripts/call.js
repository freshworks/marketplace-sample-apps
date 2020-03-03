/**
 * To set a global call tracking variable
 *
 * @param {string} sid - Call identifier
 **/
function setCallSid(sid) {
  activeCallSid = sid;
}

/**
 * Makes an API to Twilio to begin the call with the given phone number
 *
 * @param {String} phoneNumber - phone number to make call
 **/
function callApi(phoneNumber) {
  var headers = {
    "Authorization": "Basic <%= encode(iparam.twilio_sid + ':' + iparam.twilio_auth_token) %>",
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  var options = {
    headers: headers,
    form: {
      "Url": middlewareUrl + '/connect-agent',
      "To": phoneNumber,
      "From": userPhone,
      "statusCallbackEvent": ["initiated", "ringing", "answered", "completed"]
    }
  };
  var url = "https://api.twilio.com/2010-04-01/Accounts/<%= iparam.twilio_sid %>/Calls.json";
  client.request.post(url, options)
    .then(
      function (data) {
        activeCallSid = JSON.parse(data.response).sid;
        console.info('call ID');
        console.info(activeCallSid);
        activeCallSid = 1;
        callTicket = null;
        showOnCallScreen();
      },
      function (error) {
        console.error('failed to make a call API')
        console.error(error);
        showNotify('danger', 'failed to make a call. Try again later.');
      });
}

/**
 * Fills the phone number in the dialer and makes a call
 *
 * @param {String} phoneNumber - phone number to make call
 **/
function callNumber(phoneNumber) {
  $('#output').val(phoneNumber)
  callApi(phoneNumber);
};

/**
 * Open up the CTI placeholder in Freshdesk
 **/
function showCTIApp(event) {
  client.interface.trigger("show", { id: "softphone" })
    .then(function () {
      var data = event.helper.getData();
      callNumber(data.number);
    }).catch(function (error) {
      console.error('failed to open CTI placeholder');
      console.error(error);
    });
};

/**
 * Method to execute click to call event
 *
 * @param {Event} event
 **/
function clickToCallEvent(event) {
  showCTIApp(event);
};

/**
 * Clears the call state and redirect to dialpad page
 **/
function endIncompleteCall() {
  $('#callNotes').val("");
  activeCallSid = null;
  callTicket = null;
  $('#onCallScreen').hide();
  $('#callSummaryScreen').hide();
  $('#dialpad').show();
}

/**
 * Makes an API to Twilio to hangup the call with the active call SID
 *
 * @param {Boolean} isCallIncomplete - to navigate the call screen based on the call status
 **/
function hangupActiveCallApi(isCallIncomplete) {
  if ((isCallIncomplete === true) || isCallIncomplete.data) {
    endIncompleteCall();
    return;
  }
  if (!activeCallSid) {
    console.error('No call in progress')
    activeCallSid = null;
    callTicket = null;
    showCallSummaryScreen();
  } else {
    var headers = {
      "Authorization": "Basic <%= encode(iparam.twilio_sid + ':' + iparam.twilio_auth_token) %>",
      'content-type': 'application/json'
    };
    var options = {
      headers: headers,
      json: {
        Status: "completed"
      }
    };
    var url = `https://api.twilio.com/2010-04-01/Accounts/<% iparam.twilio_sid %>/Calls/${activeCallSid}.json`;
    client.request.post(url, options).then(
      function () {
        activeCallSid = null;
        callTicket = null;
        showCallSummaryScreen();
      },
      function (error) {
        console.error('failed to make call hangup API');
        console.error(error);
        activeCallSid = null;
        showCallSummaryScreen();
      });
  }
}
