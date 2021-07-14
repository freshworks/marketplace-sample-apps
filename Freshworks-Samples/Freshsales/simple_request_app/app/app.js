/**
 * Freshsales: simple_request_app
 * A sample app that fetches and displays details about the current Lead
 * in the Lead Details page using Data and Request API
 */
document.addEventListener("DOMContentLoaded", function () {
  app.initialized().then(function (_client) {
    window.client = _client;
    client.events.on("app.activated", function () {

      // Retrieves lead id of the current lead using Data API
      client.data.get("currentEntityInfo").then(function (data) {
        var leadId = data.currentEntityInfo.currentEntityId;
        getLeadDetails(leadId);
      }, function (error) {
        console.error(error);
      });
    });
  });
});


/**
* Retrieves lead details by making a request to Freshsales '/api/leads/leadId' API endpoint
* @param {Number} leadId - Identifier of the lead whose details must be retrieved
*/
function getLeadDetails(leadId) {
  client.iparams.get("account").then(function (iparam) {
    var headers = { "Authorization": "Token token=<%= (iparam.api_key) %>" };
    var options = { headers: headers };
    var url = `${iparam.account}/api/leads/` + leadId;

    client.request.get(url, options).then(function (data) {
      displayLeadDetails(data.response);
      showNotification('success', 'Lead info retrieved successfully');
    }).catch(function (e) {
      console.error('Error occurred while retrieving lead details: ', e);
    });
  })
}

/**
 * Displays a notification using Interface API
 * @param {String} type - Type of the notification
 * @param {String} message - Message to be displayed
 */
function showNotification(type, message) {
  client.interface.trigger("showNotify", {
    type: type,
    message: message
  });
}

/**
* Displays lead data obtained by hitting the Freshsales API endpoint
* @param {Object} data - Lead data object
*/
function displayLeadDetails(data) {
  var lead = (JSON.parse(data)).lead;
  document.getElementById('lead-data').innerHTML = "";

  addRow('lead-data', 'First name', lead.first_name);
  addRow('lead-data', 'Last name', lead.last_name);
  addRow('lead-data', 'Email', lead.email);
  addRow('lead-data', 'City', lead.city);
  addRow('lead-data', 'Lead Quality', lead.lead_quality);
  addRow('lead-data', 'Lead Score', lead.lead_score);
}

/**
* Adds a row to a table with a lead detail
* @param {Number} tableId - Table identifier in the HTML page
* @param {String} key - Lead detail (label)
* @param {value} value - Value of the lead detail
*/
function addRow(tableID, key, value) {
  var tableRef = document.getElementById(tableID);
  var newRow = tableRef.insertRow(-1);

  var cellOne = newRow.insertCell(0);
  cellOne.classList.add('bold');
  var cellOneText = document.createTextNode(key);
  cellOne.appendChild(cellOneText);

  var cellTwo = newRow.insertCell(1);
  var cellTwoText = document.createTextNode(value);
  cellTwo.appendChild(cellTwoText);
}
