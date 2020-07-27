exports = {

  onLeadCreateHandler: function () {
    console.log('Created a lead in \x1b[31mFreshsales\x1b[0m');
  },
  onContactCreateHandler: function () {
    console.log('Created a contact in \x1b[36mFreshCRM\x1b[0m');
  },

  onEventHandler: function () {
    $db.get('externalValue').done(data => {
      console.log(data);
    });
  },

  onExternalEvent: function (args) {
    $db.set('externalValue', args.data);
  }
};
