const createLeads = require('./createLeads');

exports = {
  // On External Event  will receive data sent to the Freshsales app's webhook
  onExternalEventHandler: function (args) {
    console.info(`External Handler for lead id ${args.data['lead_id']}`);
    createLeads.receivePayload(args.data, args.iparams);
  }
};
