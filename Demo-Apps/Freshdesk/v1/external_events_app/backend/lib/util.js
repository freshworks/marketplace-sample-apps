var base64 = loadDependency('base-64');

exports = {
  getJiraKey: function(args) {
    return base64.encode(args.iparams.jira_username + ":" + args.iparams.jira_password);
  },

  getFreshdeskKey: function(args) {
    return base64.encode(args.iparams.freshdesk_key + ":X");
  }
}
