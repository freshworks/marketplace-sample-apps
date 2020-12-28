var [apiKey, apiSecret] = ['7f4692a27293d3ad31e3bef477726198', '5fb3d3b43922cf2d12df613b6411d470'];

var superagent = require('superagent');
var handleErr = console.error;

function sendtoFrontend(data) {
  renderData(null, data.text);
}

function getQuote() {
  var quote = superagent
    .get('https://api.typingdna.com/quote')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send({ max: '45' })
    .auth(apiKey, apiSecret);

  quote.then(sendtoFrontend, handleErr);
}

function doesMatch(patterns) {
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

exports = {
  getQuote,
  doesMatch
};
