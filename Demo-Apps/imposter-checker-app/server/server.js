var superagent = require("superagent");
var handleErr = console.error;

exports = {
  getQuote,
  doesMatch,
};

function sendtoFrontend(data) {
  renderData(null, data.text);
}

/**
 * To avoid hardcoding API key, collect the API key and Secret information from iparams.json
 * They are accessible inside $request instead of superagent
 */

function getQuote(options) {
  var creds = options.iparams;
  var quote = superagent
    .get("https://api.typingdna.com/quote")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .send({ max: "45" })
    .auth(creds.apiKey, creds.apiSecret);

  quote.then(sendtoFrontend, handleErr);
}

function doesMatch(patterns) {
  var creds = patterns.iparams;
  delete patterns.iparams;
  delete patterns.isInstall;
  console.log(patterns);
  var matchLevel = superagent
    .post("https://api.typingdna.com/match")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .set("Cache-Control", "no-cache")
    .auth(creds.apiKey, creds.apiSecret)
    .send(patterns);
  matchLevel.then(sendtoFrontend, handleErr);
}
