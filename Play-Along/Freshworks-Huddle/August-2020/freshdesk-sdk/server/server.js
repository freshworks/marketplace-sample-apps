const Freshdesk = require('@freshworks/freshdesk');

exports = {
  events: [],

  createTicket: function (args) {
    const fd = new Freshdesk({ domain: args.iparams.domain, api_key: args.iparams.api_key });
    const properties = {
      email: args.email,
      subject: args.subject,
      description: args.description,
      priority: args.priority,
      status: args.status
    };
    fd.tickets.createTicket(properties).then(function (data) {
      console.log('Success: Ticket create successfull');
      console.log(JSON.stringify(data));
      return renderData(null, data)
    }, function (error) {
      console.log('Error: Ticket create error');
      console.log(JSON.stringify(error));
      return renderData({ status: error.status, message: error.message });
    });
  },

  updateTicket: function (args) {
    const fd = new Freshdesk({ domain: args.iparams.domain, api_key: args.iparams.api_key });
    const properties = {
      priority: args.priority
    };
    fd.tickets.updateTicket(args.ticketId, properties).then(function (data) {
      console.log('Success: Ticket update successfull');
      console.log(JSON.stringify(data));
      return renderData(null, data)
    }, function (error) {
      console.log('Error: Ticket update error');
      console.log(JSON.stringify(error));
      return renderData({ status: error.status, message: error.message });
    });
  },

  getTicket: function (args) {
    const fd = new Freshdesk({ domain: args.iparams.domain, api_key: args.iparams.api_key });
    const ticketId = 1;
    fd.tickets.getTicket(ticketId).then(function (data) {
      console.log('Success: Ticket fetch successfull');
      console.log(JSON.stringify(data));
      return renderData(null, data)
    }, function (error) {
      console.log('Error: Ticket fetch error');
      console.log(JSON.stringify(error));
      return renderData({ status: error.status, message: error.message });
    });
  },

  deleteTicket: function (args) {
    const fd = new Freshdesk({ domain: args.iparams.domain, api_key: args.iparams.api_key });
    fd.tickets.deleteTicket(args.ticketId).then(function (data) {
      console.log('Success: Ticket delete successfull');
      console.log(JSON.stringify(data));
      return renderData(null, data)
    }, function (error) {
      console.log('Error: Ticket delete error');
      console.log(JSON.stringify(error));
      return renderData({ status: error.status, message: error.message });
    });
  },

  searchContact: function (args) {
    const fd = new Freshdesk({ domain: args.iparams.domain, api_key: args.iparams.api_key });
    const query = `"email:'${args.query}'"`;
    fd.contacts.searchContacts({ query: query }).then(function (data) {
      console.log('Success: Ticket delete successfull');
      console.log(JSON.stringify(data));
      return renderData(null, data)
    }, function (error) {
      console.log('Error: Ticket delete error');
      console.log(JSON.stringify(error));
      return renderData({ status: error.status, message: error.message });
    });
  },
};
