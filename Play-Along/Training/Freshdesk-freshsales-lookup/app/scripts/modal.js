document.onreadystatechange = function() {
  if (document.readyState === 'interactive') renderApp();

  function renderApp() {
    var onInit = app.initialized();
    onInit
      .then(function getClient(_client) {
        window.client = _client;
        getLead();
      })
      .catch(handleErr);
  }
};

/**
 * Fuction to get the lead details using instance API
 */
function getLead() {
  client.instance.context().then(function(context) {
    renderTable(context.data.lead);
  });
}

/**
 * function to render the lead to html table output
 * @param {Object} lead
 */

async function renderTable(lead) {
  let tableContent = `
  <table class="table">
  <thead>
  </thead>
    <tbody>
      <tr>
        <td>Name</td>
        <td>${lead.first_name} ${lead.last_name ? lead.last_name : ''}</td>
      </tr>
      <tr>
        <td> Job Title </td>
        <td> ${lead.job_title ? lead.job_title : 'Job Title Not Updated'} </td>
      </tr>
    <tr>
       <td>Email</td>
      <td>${lead.email}</td>
     </tr>
     <tr>
       <td>Work Phone Number</td>
       <td>${lead.work_phone_number
         ? lead.work_phone_number
         : 'Work Phone Number Not Available'}</td>
    </tr>
    <tr>
      <td>Mobile Phone Number</td>
      <td>${lead.mobile_phone_number
        ? lead.mobile_phone_number
        : 'Mobile Phone Number Not Available'}</td>
    </tr>
    <tr>
       <td> Lead Quality</td>
       <td> ${lead.lead_quality} </td>
    </tr>
  </tbody></table>`;

  // Check if the lead is already in the data storage
  let inDataStorage = await isInDataStore(lead.id);

  // Conditonally display the button or messgae based on inDataStorage's value
  if (inDataStorage.status === 404) {
    tableContent += ` <fw-button color="primary" onclick="saveLead()"> Save the lead </fw-button>`;
  } else {
    tableContent += `<h3> This Lead already exist in the data storage</h3>`;
  }

  // Append the rendered table to the html
  document.getElementById('agentDetails').innerHTML = tableContent;
}

/**
 * Function to save the lead in the data storage based on user input
 */
function saveLead() {
  client.instance.context().then(function(context) {
    saveDataInDB(context.data.lead);
  });
}

/**
 * Helper function to save the lead in the data storage
 * @param {Object} lead
 */
function saveDataInDB(lead) {
  client.db.set(lead.id.toString(), { lead }, { setIf: 'not_exist' }).then(
    function(data) {
      notify('info', 'Saved the lead in Data Storage');
      console.info('Saved the lead in Data Storage', data);
    },
    function(error) {
      notify('info', 'Unable to save data in Data Storage');
      console.error('Unable to save data in Data Storage', error);
    }
  );
}

/**
 * Helper function to check the data storage if the lead is already available
 * @param {String} leadId
 */
function isInDataStore(leadId) {
  return client.db.get(leadId.toString()).then(
    function(data) {
      return data;
    },
    function(error) {
      return error;
    }
  );
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

function handleErr(
  error,
  message = 'Something went wrong & this is what we know:'
) {
  console.log(message, error);
  notify('info', 'Unable to Display Lead Details, kindly refresh the page ');
}
