var base64 = require("base-64");
exports = {
  getFreshdeskKey: function (args) {
    return base64.encode(args.iparams.freshdesk_key + ":X");
  },

  getHubSpotKey: function (args) {
    return base64.encode(args.iparams.hubspot_key);
  },
};
