const twilio = require('twilio');

exports = {
  sendSMS: function(args) {
    const iparams = args.iparams;
    const accountSid = iparams.account_sid;
    const authToken = iparams.auth_token;
    const client = new twilio.RestClient(accountSid, authToken);
    
    return client.messages.create({
      body: args.message,
      to: args.phone,
      from: iparams.from_number
    }, renderData);
  }
};
