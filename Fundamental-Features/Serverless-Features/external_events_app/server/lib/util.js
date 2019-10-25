var base64 = require('base-64');

exports = {
  getJiraKey: function (args) {
    return base64.encode(args.iparams.jira_username + ":" + args.iparams.jira_password);
  }
}
