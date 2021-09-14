/**
 * Delegated the tasks into two categories
 * 1) Working Business Logic of the app
 * 2) Best security practices
 * 3) Suggested coding guidelines
 * Have got 5 tasks within the code that adheres to these categories
 * Add or remove the code to make the app fall under these categories
 */

 /**
  * Tasks 1,2,3 are hidden within the code
  * They belong to the 2nd and 3rd categories
  * Lets fix it before we run the app
  */

 'use strict';
 const base64 = require('base-64');
 const { request } = require('./lib/index');
 const ERROR_MSG = 'Seems like either the employee is already an agent or a there has been a DISASTER :(';

 const empFullName = (employee) => `${employee.first_name} ${employee.last_name}`;

 /**
  * Freshteam api to return department details
  */
 const getDepartmentDetails = async (params, departmentId) => {
   const url = `${params.freshteam.base}/departments/${departmentId}`;

   const options = {
     method: 'get',
     headers: {
       Authorization: `Bearer ${params.freshteam.encodedApiKey}`
     },
   };

   const response = await request(url, options);
   const departmentDetails = JSON.parse(response.body);

   return departmentDetails;
 };

 const getEmployeeDepartment = async (params, employee, cb) => {
   const { department_id } = employee;

   const departmentDetails = await getDepartmentDetails(params, department_id);

   cb(departmentDetails);
 };

 const onboardInFreshdesk = async (params, employee) => {
   const url = `${params.freshdesk.base}/agents`;

   const body = {
     ticket_scope: 1,
     name: empFullName(employee),
     email: employee.official_email,
     phone: employee.phone_numbers[0] || null,
     job_title: 'Customer Support Agent'
   };

   const options = {
     method: 'post',
     headers: {
       Authorization: `Basic ${params.freshdesk.encodedApiKey}`,
       'Content-Type': 'application/json'
     },
     body: JSON.stringify(body)
   };

   try {
     const response = await request(url, options);
     if (response) {
       return `Successfully onboarded ${empFullName(employee)} in Freshdesk`
     }
   } catch(er) {
     console.error(JSON.stringify(er));
     return ERROR_MSG;
   }
 };

 /**
  * Task 4 - Onboard the employee in Freshsales account
  * Unfortunately there is no api to create user in Freshsales account today
  * There is however a work around
  * Hint - Use service request api in Freshservice
  * https://api.freshservice.com/v2/#service_request
  */
 const onboardInFreshsales = (params, employee) => {

 };

 /**
  * Task 5 - Onboard the employee in Freshservice account as IT Admin
  * https://api.freshservice.com/v2/#create_an_agent
  */
 const onboardInFreshservice = (params, employee) => {

 };

 const onboardEmployee = async (params, employeeDepartment, employee, cb) => {
   let response;
   switch(employeeDepartment.name) {
     case 'Customer Support':
       response = await onboardInFreshdesk(params, employee);
       break;
     case 'IT Administration':
       response = await onboardInFreshservice(params, employee);
       break;
     case 'Sales':
       response = await onboardInFreshsales(params, employee);
       break;
     default:
       response = 'Employee belongs to an unrecognized department'
   }

   cb(response);
 };

 exports = {
   onEmployeeCreateHandler: async function(args) {
     // Logging the entire payload
     console.log(JSON.stringify(args));
     const { employee } = args.data;
     const { iparams } = args;

     // Logging iparams
     console.log('iparams with some secured information are ', JSON.stringify(iparams));

     const encode = (str) => base64.encode(str);

     const params = {
       freshdesk: {
         base: `https://${iparams.freshdeskDomain}.freshdesk.com/api/v2`,
         encodedApiKey: encode(iparams.freshdeskApiKey)
       },
       freshservice: {
         base: `https://${iparams.freshserviceDomain}.freshservice.com/api/v2`,
         encodedApiKey: encode(iparams.freshserviceApiKey)
       },
       freshteam: {
         base: `https://${iparams.freshteamDomain}.freshteam.com/api`,
         encodedApiKey: iparams.freshteamApiKey
       }
     }

     getEmployeeDepartment(params, employee, function(employeeDepartment) {
       onboardEmployee(params, employeeDepartment, employee, function(response) {
         console.log(response);
       });
     });

   }
 };
