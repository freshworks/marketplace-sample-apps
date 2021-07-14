exports = {

  events: [
    { event: 'onEmployeeCreate', callback: 'onEmployeeCreateHandler' }
  ],

  /**
   * 
   * @param {object} args  Payload from the event 
   */
  onEmployeeCreateHandler: function (args) {

    var employeeName = `${args.data.employee.first_name} ${args.data.employee.last_name}`;
    var employeeEmail = args.data.employee.user_emails[0];
    var description = ` Please initiate issuance of laptop and other devices to the ${employeeName}`
    var subdomain = args.iparams.freshservice_subdomain;
    CreateFreshserviceTicket(employeeName, description, employeeEmail, subdomain)
  }

};

/**
 * Function to create Freshservice Ticket when new employee is created 
 * @param {String} title 					Ticket title
 * @param {String} description 		Ticket description
 * @param {String} email 					email of the newly created employee 
 */
function CreateFreshserviceTicket(title, description, email, subdomain) {

  $request.post(`https://${subdomain}.freshservice.com/api/v2/tickets`, {
    headers: {
      Authorization: "Basic <%= encode(iparam.freshservice_api_key)%>",
      "Content-Type": "application/json;charset=utf-8"
    },

    body: JSON.stringify({
      description: `${description}`,
      email: `${email}`,
      priority: 1,
      status: 2,
      subject: `${title}`
    })
  }).then(function () {
    console.info('Successfully created ticket');
  }).catch(
    function (error) {
      console.error('Unable to create ticket');
      console.error(error);

    });

}
