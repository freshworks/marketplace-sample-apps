const btoa = require('btoa');
const Freshdesk = require('freshdesk-sdk');

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
    /**
     * TASK: 1
     *
     * Pass the ticketId from the args as a method argument to fetch the ticket entity
     *
     * Example: {id: 1}
     */
    fd.tickets.getTicket().then(function (data) {
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
    /**
     * TASK: 2
     *
     * Convert this Request method to SDK method for the delete action.
     */
    $request.delete(`https://${baseUrl}/api/v2/tickets/${args.ticketId}`, {
      headers: {
        Authorization: "Basic " + btoa(apiKey + ":x")
      }
    }).then(function (data) {
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

    /**
     * TASK: 4
     *
     * Add handler code to search contact with SDK method
     */
  },
};
