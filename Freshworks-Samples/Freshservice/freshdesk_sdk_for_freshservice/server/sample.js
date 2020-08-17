let freshdesk = require('freshdesk-sdk');
let fd2 = new freshdesk({ domain: 'freshworksrelations941', api_key: 'jeFi1HwivfihA3PCpbdy' });


fd2.tickets.getTicket({ id: 6, opts: {}}).then(function (result) {
  console.log('Data');
  console.log(result);
}).catch(function (err) {
  console.log('Error');
  console.log(err);
});

// fd.tickets.listTickets({}).then(function(data) {
//   console.log('List tickets called successfully');
//   console.log(data);
// }).catch(function (error) {
//   console.log('List tickets Error');
//   console.log(error);
// });

// fd.tickets.updateTicket(45, {
//   status: 3,
//   priority: 2,
//   source: 2,
//   description: 'detailed description'
// }).then(function (data) {
//   console.log('Ticket update Successful');
//   console.log(data);
// }).catch(function (error) {
//   console.log('Ticket update Error');
//   console.log(error);
// });

// fd.tickets.deleteTicket(227).then(function (data) {
//   console.log('Ticket Delete successfull');
//   console.log(data);
// }).catch(function (error) {
//   console.log('Delete ticket error');
//   console.log(error);
// });

// fd.tickets.restoreTicket(228).then(function (data) {
//   console.log('Ticket Restore successfull');
//   console.log(data);
// }).catch(function (error) {
//   console.log('Restore ticket error');
//   console.log(error);
// });

// fd.tickets.searchTicket( "\"priority:3\"" ).then(function (data) {
//   console.log('Ticket search successfull');
//   console.log(data);
// }).catch(function (error) {
//   console.log('Search ticket error');
//   console.log(error);
// });

// fd.tickets.replyTicket( 228, { body: 'sample reply'} ).then(function (data) {
//   console.log('Ticket reply successfull');
//   console.log(data);
// }).catch(function (error) {
//   console.log('Reply ticket error');
//   console.log(error);
// });

// fd.tickets.addNotes( 228, { body: 'sample notes'} ).then(function (data) {
//   console.log('Ticket notes successfull');
//   console.log(data);
// }).catch(function (error) {
//   console.log('Ticket notes error');
//   console.log(error);
// });

// fd.tickets.listTicketTimeEntries( 10, { } ).then(function (data) {
//   console.log('Ticket time entries successfull');
//   console.log(data);
// }).catch(function (error) {
//   console.log('Ticket time entries error');
//   console.log(error);
// });

// fd.tickets.listTicketSatisfactionRatings(10).then(function (data) {
//   console.log('Ticket Satisfaction ratings successfull');
//   console.log(data);
// }).catch(function (error) {
//   console.log('Ticket Satisfaction ratings error');
//   console.log(error);
// });

// fd.tickets.deleteAttachment(229).then(function (data) {
//   console.log('Delete attachment successfull');
//   console.log(data);
// }).catch(function (error) {
//   console.log('Delete attachment error');
//   console.log(error);
// });

// fd.ticketFields.createAdminTicketField({
//   label: 'test_field',
//   type: 'custom_text',
//   label_for_customers: 'Serverless test checkbox'
// }).then(function (data) {
//   console.log('create Admin TicketField successfull');
//   console.log(data);
// }).catch(function (error) {
//   console.log('create Admin TicketField error');
//   console.log(error.data.errors);
// });

// fd.ticketFields.getAllAdminTicketFields({}).then(function (data) {
//   console.log('Get all Admin TicketField successfull');
//   console.log(data);
// }).catch(function (error) {
//   console.log('Get all Admin TicketField error');
//   console.log(error);
// });

// fd.ticketFields.deleteTicketField(5782318).then(function (data) {
//   console.log('Delete TicketField successfull');
//   console.log(data);
// }).catch(function (error) {
//   console.log('Delete TicketField error');
//   console.log(error);
// });

// fd.ticketFields.getAdminTicketField(5289280).then(function (data) {
//   console.log('Get admin TicketField successfull');
//   console.log(data);
// }).catch(function (error) {
//   console.log('Get admin TicketField error');
//   console.log(error);
// });

// fd.ticketFields.getAllTicketFields({}).then(function (data) {
//   console.log('Get all TicketField successfull');
//   console.log(data);
// }).catch(function (error) {
//   console.log('Get all TicketField error');
//   console.log(error);
// });

// fd.ticketFields.updateAdminTicketField(5600212,{
//   label_for_customers: "Updated"
// }).then(function (data) {
//   console.log('Update admin TicketField successfull');
//   console.log(data);
// }).catch(function (error) {
//   console.log('Update admin TicketField error');
//   console.log(error);
// });

// fd.conversations.getAllTicketConversations(229, {}).then(function (data) {
//   console.log('Get conversations successfull');
//   console.log(data);
// }).catch(function (error) {
//   console.log('Get conversations error');
//   console.log(error);
// });

// fd.conversations.updateConversation( 24793652, {
//   body: 'Updated convo'
// }).then(function (data) {
//   console.log('Update conversations successfull');
//   console.log(data);
// }).catch(function (error) {
//   console.log('Update conversations error');
//   console.log(error);
// });

// fd.conversations.deleteConversation(24830724).then(function (data) {
//   console.log('Delete conversations successfull');
//   console.log(data);
// }).catch(function (error) {
//   console.log('Delete conversations error');
//   console.log(error);
// });

// fd.ticketFieldSections.createTicketFieldSection(229, {
//   label: 'test section',
// }).then(function (data) {
//   console.log('Create ticket field section successfull');
//   console.log(data);
// }).catch(function (error) {
//   console.log('Create ticket field section error');
//   console.log(error);
// });

// fd.ticketFieldSections.getAllTicketFieldSections(229, {
//   label: 'test section',
// }).then(function (data) {
//   console.log('Get all ticket field section successfull');
//   console.log(data);
// }).catch(function (error) {
//   console.log('Get all ticket field section error');
//   console.log(error);
// });

// fd.contacts.createContact({ name: 'Wrapper Test Contact', email: 'mail_id' }).then(function (data) {
//   console.log('Create Contact successfull');
//   console.log(data);
// }).catch(function (error) {
//   console.log('Create contact error');
//   console.log(error);
// });

// fd.contacts.getAllContacts({}).then(function (data) {
//   console.log('Get all Contacts successfull');
//   console.log(data);
// }).catch(function (error) {
//   console.log('Get all contacts error');
//   console.log(error);
// });

// fd.contacts.deleteContact(48009183354).then(function (data) {
//   console.log('Delete contact successfull');
//   console.log(data);
// }).catch(function (error) {
//   console.log('Delete contact error');
//   console.log(error);
// });

// fd.contacts.exportContacts({
//   fields: {
//     default_fields: ["name", "email"],
//     custom_fields: []
//   }
// }).then(function (data) {
//   console.log('Export contacts successfull');
//   console.log(data);
// }).catch(function (error) {
//   console.log('Export contacts error');
//   console.log(error);
// });

// fd.contacts.getContact(48009426214).then(function (data) {
//   console.log('Get contact successfull');
//   console.log(data);
// }).catch(function (error) {
//   console.log('Get contact error');
//   console.log(error);
// });

// fd.contacts.getContactFields().then(function (data) {
//   console.log('Get contact fields successfull');
//   console.log(data);
// }).catch(function (error) {
//   console.log('Get contact fields error');
//   console.log(error);
// });