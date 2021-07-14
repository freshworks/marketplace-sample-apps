
document.addEventListener("DOMContentLoaded", function () {
  app.initialized()
    .then(
      function (_client) {
        window.client = _client;
        unCachedResponse();
      },
      function (error) {
        console.log("error", error);
        notify('info', 'Unable to Display Ticket Details, kindly refresh the page ');
      });
});

/**
 * Function to demonstrate uncahed response
 */
function unCachedResponse() {
  client.instance.context().then(
    function (context) {
      getAgentData(context.data.agentID)
    }
  );
}

/**
 * Function to fetch Agent to Display Data
 * @param {String} agentID
 */
function getAgentData(agentID) {
  var options = {
    headers: {
      Authorization: "Basic <%= encode(iparam.freshservice_api_key)%>",
      "Content-Type": "application/json;charset=utf-8"
    }
  };
  client.iparams.get('freshservice_subdomain').then(function (iparam) {
    client.request.get(`https://${iparam.freshservice_subdomain}.freshservice.com/api/v2/agents/${agentID}`, options)
      .then(function (data) {
        try {
          renderTable(JSON.parse(data.response).agent);
        } catch (error) {
          console.error("Error while attempting to show issue", error);
          notify('error', 'Unable to Display Data, kindly refresh the page ');
        }
      })
      .catch(function (error) {
        console.error("error", error);
        notify('error', 'Unable to Display Data, kindly refresh the page ');
      });
  });
}

/**
 * Fcuntion to Generate and render table
 * @param {String} agent Selected agent
 */
function renderTable(agent) {

  var tableContent = `<table class="table">
                          <thead>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Name</td>
                              <td>${agent.first_name} ${agent.last_name ? agent.last_name : ''}</td>
                            </tr>
                            <tr>
                              <td> Job Title </td>
                              <td> ${agent.job_title ? agent.job_title : 'Job Title Not Updated'} </td>
                            </tr>
                            <tr>
                              <td>Email</td>
                              <td>${agent.email}</td>
                            </tr>
                            <tr>
                              <td>Work Phone Number</td>
                              <td>${agent.work_phone_number ? agent.work_phone_number : 'Work Phone Number Not Available'}</td>
                            </tr>
                            <tr>
                              <td>Mobile Phone Number</td>
                              <td>${agent.mobile_phone_number ? agent.mobile_phone_number : 'Mobile Phone Number Not Available'}</td>
                            </tr>
                            <tr>
                              <td> Occasional Agent Status</td>
                              <td> ${agent.occasional} </td>
                            </tr>
                          </tbody>
                      </table>`

  document.getElementById('agentDetails').insertAdjacentHTML('beforeend', tableContent);
}

/**
 *
 * @param {String} status Status of the Notififcation
 * @param {String} message Message for the notification
 */
function notify(status, message) {
  client.interface.trigger('showNotify', {
    type: status,
    message: message
  });
}
