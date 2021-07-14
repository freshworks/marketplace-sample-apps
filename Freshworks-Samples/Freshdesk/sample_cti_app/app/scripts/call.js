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
  client.iparams.get('twilio_sid').then(function (iparam) {
    var url = `https://api.twilio.com/2010-04-01/Accounts/${iparam.twilio_sid}/Calls.json`;
    client.request.post(url, options)
      .then(
        function (data) {
          activeCallSid = JSON.parse(data.response).sid;
          callTicket = null;
          showOnCallScreen();
        },
        function (error) {
          console.error('failed to make a call API')
          console.error(error);
          showNotify('danger', 'failed to make a call. Try again later.');
        });
  });
}

/**
 * Fills the phone number in the dialer and makes a call
 *
 * @param {String} phoneNumber - phone number to make call
 **/
function callNumber(phoneNumber) {
  document.getElementById('output').value = phoneNumber;
  callApi(phoneNumber);
};

/**
 * Open up the CTI placeholder in Freshdesk
 **/
function showCTIApp(event) {
  client.interface.trigger("show", { id: "softphone" })
    .then(function () {
      if (event) {
        var data = event.helper.getData();
        callNumber(data.number);
      }
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
  document.getElementById('callNotes').value = '';
  activeCallSid = null;
  callTicket = null;
  document.getElementById('onCallScreen').style.display = 'none';
  document.getElementById('callSummaryScreen').style.display = 'none';
  document.getElementById('dialpad').style.display = 'block';
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
    client.iparams.get('twilio_sid').then(function (iparam) {
      var url = `https://api.twilio.com/2010-04-01/Accounts/${iparam.twilio_sid}/Calls/${activeCallSid}.json`;
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
    });
  }
}
