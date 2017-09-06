var request = loadDependency('request');
var base64 = loadDependency('base-64');

exports = {

  events: [
    { event: 'onAppInstall', callback: 'onInstallHandler' },
    { event: 'onAppUninstall', callback: 'onUnInstallHandler' },
    { event: 'onExternalEvent', callback: 'onWebhookCallbackHandler'}
  ],

  onInstallHandler: function(args) {
    var auth_passwd = base64.encode(args.iparams.username+":"+args.iparams.token);
    var options = {};
    options.url = `https://api.github.com/repos/${args.iparams.username}/${args.iparams.repo}/hooks`;
    options.headers = {
      "Authorization": "Basic "+auth_passwd,
      "User-Agent": "ext-app"
    };
    generateTargetUrl().done(function(data){
      options.json = {
        "name": "web",
        "active": true,
        "events": [
          "push",
          "pull_request"
        ],
        "config": {
          "url": data,
          "content_type": "json"
        }
      };
      request.post(options, function(err, res, body){
        if(err){
          renderData(err, { status: 400, message: "Failed" });
        }
        else if(res.statusCode == 201){
          var result = body;
          $db.set('githubHookId', { id : result.id }).done(function(data){
            renderData(null, { status: 200, message: "success" });
          })
          .fail(function(err){
            renderData(err, { status: 400, message: "Failed" });
          });
        }
        else{
          renderData(null, { status: 400, message: "Failed" });
        }
      });
    })
    .fail(function(err){
      renderData(err, { status: 400, message: "Failed" });
    });
  },

  onUnInstallHandler: function(args) {
    var auth_passwd = base64.encode(args.iparams.username+":"+args.iparams.token);
    var options = {};
    options.headers = {
      Authorization: "Basic " + auth_passwd,
      "User-Agent": "ext-app"
    };
    $db.get('githubHookId').done(function(data){
      options.url = `https://api.github.com/repos/${args.iparams.username}/${args.iparams.repo}/hooks/${data.id}`;
      request.delete(options, function(err, res, body){
          renderData(null, { status: 200, message: "success" });
      });
    })
    .fail(function(err){
      renderData(err, { status: 400, message: "Failed" });
    });
  },

  onWebhookCallbackHandler: function(args) {
    request({
      url: "https://" + args.iparams.freshdeskdomain + ".freshdesk.com/api/v2/tickets",
      method: "POST",
      headers: {
        Authorization: base64.encode(args.iparams.freshdeskapikey + ":X")
      },
      json: {
        subject: "Github Action",
        description: JSON.stringify(args.data),
        email: "raghuram.periaswamy@freshworks.com",
        priority: 1,
        status: 2
      }
    }, function(err, resp, respBody) {
      console.log(err);
      console.log(respBody);
    })
  }
};
