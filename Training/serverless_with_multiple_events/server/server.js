exports = {

  events: [
    { event: 'onTicketCreate' ,  callback: 'onTicketCreateHandler'  },
    { event: 'onAppInstall'   ,  callback: 'onAppInstallHandler'    },
    { event: 'onExternalEvent',  callback: 'onExternalEventHandler' },
    { event: 'onAppUninstall' ,  callback: 'onAppUninstallHandler'  }
  ],

  onAppInstallHandler: function(args) {

    generateTargetUrl()
    .then(function(url) {
      console.log(url);

      // Make request to third party products (ex. JIRA) to register the webhook for this Url
      renderData();
    }, function(err) {
      
      console.log(err);
      renderData({
        message: 'Error generating target Url'
      });
    });
  },

  onTicketCreateHandler: function(args) {
    console.log(args);
  },

  onExternalEventHandler: function(args) {
    // Events pushed from third pary products (ex. JIRA)
  },

  onAppUninstallHandler: function(args) {
    // De-Register webhook from third party
    renderData();
  }
};
