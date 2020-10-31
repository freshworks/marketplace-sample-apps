var headers = {
  Authorization: 'Token token=<%= (iparam.freshsales_api_key) %>'
};

var options = { headers };

document.onreadystatechange = function() {
  if (document.readyState === 'interactive') renderApp();

  function renderApp() {
    var onInit = app.initialized();
    onInit
      .then(function getClient(_client) {
        window.client = _client;
        client.events.on('app.activated', getLeads, handleErr);
      })
      .catch(handleErr);
  }
};

/**
 * Function to get list of all leads from Freshsales
 */
function getLeads() {
  const URL = '<%= (iparam.freshsales_subdomain) %>/api/leads/filters';

  var leads = client.request.get(URL, options);
  leads
    .then(function showLeadsList(data) {
      let listOfViews, allLeadsView;
      listOfViews = JSON.parse(data.response).filters;
      allLeadsView = listOfViews.filter(view => view.name === 'All Leads');
      viewLeads(allLeadsView[0].id);
    })
    .catch(handleErr);
}

/**
 * Helper function to obtain list of all leads with the view ID
 * @param {String} viewId
 */
function viewLeads(viewId) {
  var url = `<%= (iparam.freshsales_subdomain) %>/api/leads/view/${viewId}`;
  var leadDetails = client.request.get(url, options);

  leadDetails
    .then(function renderLeadDetails(data) {
      let leads = JSON.parse(data.response).leads;
      renderTable(leads);
    })
    .catch(handleErr);
}

/**
 * Function to Genreate and Render table data
 * @param {Array} table Data to be rendered in the table
 */
function renderTable(table) {
  var tableContainer = `<table class="table">`;
  var tableHead = `<thead style="width:50%"> <tr> <th>Ticket ID </th> <th>Ticket Name</th> </tr> </thead>`;
  var tableBody = `<tbody>`;
  var tableContent = '';

  for (tableItem of table) {
    tableContent += `<tr id=${tableItem.id} onclick="openModal(this.id)"><td>${tableItem.id}</td><td>${tableItem.first_name} ${tableItem.last_name
      ? tableItem.last_name
      : ''}</td></tr>`;
  }

  var html = `${tableContainer}${tableHead}${tableBody}${tableContent}</tbody></table>`;
  document.getElementById('table').innerHTML = html;
}

/**
 * Function to Open modal with Lead Details
 * @param {String} id ID of the agent to be viewed
 */
function openModal(id) {
  const url = `<%= (iparam.freshsales_subdomain) %>/api/leads/${id}`;
  client.request
    .get(url, options)
    .then(function(data) {
      let lead = JSON.parse(data.response).lead;

      // Passing to Lead Data to interface method, which can be retrieved in the modal using Instance method
      client.interface.trigger('showModal', {
        title: 'Lead Details',
        template: './views/modal.html',
        data: { lead: lead }
      });
    })
    .catch(handleErr);
}

/**
 *
 * @param {String} status Staus of the Notififcation
 * @param {String} message Message for the notification
 */
function notify(status, message) {
  client.interface.trigger('showNotify', {
    type: status,
    message: message
  });
}

function handleErr(err, message = 'Something went Wrong') {
  console.log(message, err);
  notify('info', message);
}
