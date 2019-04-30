var base64 = require('base-64');

exports = {
    getFsAPIKey: function(args) {
        return "Basic " +base64.encode(args.iparams.fs_api_key + ":X");
    },

    getFdAPIKey: function(args) {
        return base64.encode(args.iparams.fd_api_key + ":X");
    }
};