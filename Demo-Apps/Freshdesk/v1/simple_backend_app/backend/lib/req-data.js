
var base64 = loadDependency('base-64');

const twilioBaseUrl = 'https://api.twilio.com';

// getting request data used to make the api call
function getRequestParams(args) {
  // getting the iparams from the args.
  var iparams = args.iparams;
  var account_sid = iparams.account_sid;
  // using the base-64 npm to encode the values.
  var token = base64.encode(account_sid+':'+iparams.auth_token);
  return {
    method: 'POST',
    url: twilioBaseUrl +'/2010-04-01/Accounts/'+ account_sid +'/SMS/Messages.json',
    form: {
      To: iparams.to_number,
      From: iparams.from_number,
      Body: args.message
    },
    headers: {
      Authorization: 'Basic ' + token,
      content_type: 'application/x-www-form-urlencoded'
    }
  }
}

exports = getRequestParams;