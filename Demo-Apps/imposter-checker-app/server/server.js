var superagent = require('superagent');
var handleErr = console.error;
var apiKey, apiSecret;
console.log(apiKey, apiSecret)

exports = {
  getQuote,
  doesMatch,
  events: [{ event: 'onAppInstall', callback: 'retrive_apiKey_secret' }],
  retrive_apiKey_secret: function(payload) {
    var { apiSecret, apiKey } = payload.iparams;
    renderData();
  }
};

function sendtoFrontend(data) {
  renderData(null, data.text);
}

function getQuote(apiKey, apiSecret) {
  var quote = superagent
    .get('https://api.typingdna.com/quote')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send({ max: '45' })
    .auth(apiKey, apiSecret);

  quote.then(sendtoFrontend, handleErr);
}

function doesMatch(patterns, apiKey, apiSecret) {
  delete patterns.iparams;
  delete patterns.isInstall;
  console.log(patterns);
  var matchLevel = superagent
    .post('https://api.typingdna.com/match')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Cache-Control', 'no-cache')
    .auth(apiKey, apiSecret)
    .send(patterns);
  matchLevel.then(sendtoFrontend, handleErr);
}
