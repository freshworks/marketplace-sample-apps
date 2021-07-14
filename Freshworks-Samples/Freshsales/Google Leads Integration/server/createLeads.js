const leadMapping = {
  "FULL_NAME": "name",
  "PHONE_NUMBER": "mobile_number",
  "EMAIL": "email"
}

// Lead mapping which will map the Google leads payload fields to Freshsales fields
exports.receivePayload = (googleLeadsPayload, iparams) => {
  constructFreshsalesPayload(googleLeadsPayload, iparams);
}
// constructing a payload to create a lead in freshsales
const constructFreshsalesPayload = (googleLeadsPayload, iparams) => {
  let freshsalesCreateLeadPayload = {};
  freshsalesCreateLeadPayload['lead'] = {}
  for (let fields in googleLeadsPayload['user_column_data']) {
    if (googleLeadsPayload['user_column_data'][fields]['column_id'] === 'FULL_NAME') {
      freshsalesCreateLeadPayload = handleName(googleLeadsPayload['user_column_data'][fields]['string_value'], freshsalesCreateLeadPayload);
    } else if (googleLeadsPayload['user_column_data'][fields]['column_id'] in leadMapping) {
      freshsalesCreateLeadPayload['lead'][leadMapping[googleLeadsPayload['user_column_data'][fields]['column_id']]] = googleLeadsPayload['user_column_data'][fields]['string_value'];
    }
  }
  createLeadinFreshsales(freshsalesCreateLeadPayload, iparams)
}
// constructing headers and making POST api call to create a lead in Freshsales
function createLeadinFreshsales(freshsalesPayload, iparams) {
  let createLeadsUrl = `https://${iparams.domain}.freshsales.io/api/leads`;
  let options = {
    'headers': {
      "Authorization": "Token token=<%= iparam.token %>",
      "content-type": "application/json"
    },
    'body': JSON.stringify(freshsalesPayload)
  }
  $request.post(createLeadsUrl, options).then(function (data) {
    console.info(JSON.parse(data.response), 'Payload creation response');
  }, function (err) {
    console.error(err, 'Error in creating leads check for mandatory fields');
  })
}
const handleName = (name, payload) => {
  name = name.split(' ');
  if (name.length === 2) {
    payload["lead"]['firstName'] = name[0];
    payload["lead"]['lastName'] = name[1];

  } else {
    payload["lead"]['lastName'] = name[0];
  }
  return payload
}
