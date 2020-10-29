$(document).ready(function () {
	app.initialized().then(function (_client) {
		window.client = _client;
		client.events.on(
			"app.activated",
			function () {
				getLeads();
			},
			function (error) {
				console.log("Error", error);
				notify("info", "Unable to Open to App");
			}
		);
	});
});

/**
 * Function to get list of all leads from Freshsales
 */
function getLeads() {
	var headers = {
		Authorization: "Token token=<%= (iparam.freshsales_api_key) %>",
	};
	var options = { headers: headers };
	var url = "<%= (iparam.freshsales_subdomain) %>/api/leads/filters";

	client.request
		.get(url, options)
		.then(function (data) {
			let listOfViews = JSON.parse(data.response).filters;
			console.log("filters", listOfViews);
			let allLeadsView = listOfViews.filter(
				(view) => view.name === "All Leads"
			);
			console.log("allLeadsView", allLeadsView);
			viewLeads(allLeadsView[0].id);

			//displayLeadDetails(data.response);
			//showNotification('success', 'Leads info retrieved successfully');
		})
		.catch(function (e) {
			console.error("Error occurred while retrieving lead details: ", e);
		});
}

/**
 * Helper function to obtain list of all leads with the view ID
 * @param {String} viewId 
 */
function viewLeads(viewId) {

	var headers = {
		Authorization: "Token token=<%= (iparam.freshsales_api_key) %>",
	};
	var options = { headers: headers };
	var url = `<%= (iparam.freshsales_subdomain) %>/api/leads/view/${viewId}`;

	client.request
		.get(url, options)
		.then(function (data) {
			let leads = JSON.parse(data.response).leads;
			renderTable(leads);
		})
		.catch(function (e) {
      console.error("Error occurred while retrieving lead details: ", e);
      notify('info', 'Error occurred while retrieving lead details')
		});
}

/**
 * Function to Genreate and Render table data
 * @param {Array} table Data to be rendered in the table
 */
function renderTable(table) {
	var tableContainer = `<table class="table">`;
	var tableHead = `<thead> <tr> <th>Ticket ID </th> <th>Ticket Name</th> </tr> </thead>`;
	var tableBody = `<tbody>`;
	var tableContent = "";

	for (tableItem of table) {
		tableContent += `<tr id=${tableItem.id} onclick="openModal(this.id)"><td>${
			tableItem.id
		}</td><td>${tableItem.first_name} ${
			tableItem.last_name ? tableItem.last_name : ""
		}</td></tr>`;
	}
	var html = `${tableContainer}${tableHead}${tableBody}${tableContent}</tbody></table>`;
	document.getElementById("table").innerHTML = html;
}


/**
 * Function to Open modal with Lead Details
 * @param {String} id ID of the agent to be viewed
 */
function openModal(id) {
	var headers = {
		Authorization: "Token token=<%= (iparam.freshsales_api_key) %>",
	};
	var options = { headers: headers };
	var url = `<%= (iparam.freshsales_subdomain) %>/api/leads/${id}`;
	client.request
		.get(url, options)
		.then(function (data) {
      let lead = JSON.parse(data.response).lead;
      
      // Passing to Lead Data to interface method, which can be retrieved in the modal using Instance method
			client.interface.trigger("showModal", {
				title: "Lead Details",
				template: "modal.html",
				data: { lead: lead },
			});
		})
		.catch(function (e) {
      console.error("Error occurred while sending lead details to modal:  ", e);
      notify('info', 'Error occurred while sending lead details to modal')
		});
}


/**
 *
 * @param {String} status Staus of the Notififcation
 * @param {String} message Message for the notification
 */
function notify(status, message) {
	client.interface.trigger("showNotify", {
		type: status,
		message: message,
	});
}
