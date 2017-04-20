
var twilio = loadDependency('twilio');

exports = {

  sendSMS: function(args) {
    var iparams = args.iparams;
    var accountSid = iparams.account_sid;
    var authToken = iparams.auth_token;
    var client = new twilio.RestClient(accountSid, authToken);
    client.messages.create({
      body: args.message,
      to: args.phone,  // Text this number
      from: iparams.from_number // From a valid Twilio number
    }, function(err, message) {
      if (err) {
        console.error(err.message);
      }
      if (message) {
        console.log(message);
      }
    });
    // Nothing to return, so the renderData method returns empty JSON
    renderData(null, { });
  }
};
