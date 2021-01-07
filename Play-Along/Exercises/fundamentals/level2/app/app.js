/**
 * App Initializer
 */
document.addEventListener("DOMContentLoaded", function () {
	app.initialized()
		.then(function (_client) {
			window.client = _client;
			registerClickEventHandlers();
		})
		.catch(function (error) {
			console.error('Error during initialization' + error);
		});
});

/**
 * Register the click event handlers for `Create Issue` and `View Issue Details` buttons
 */
function registerClickEventHandlers() {
	document.getElementById('createIssue').addEventListener('click', function () {
		createIssue();
	});

	document.getElementById('viewIssue').addEventListener('click', function () {
		viewIssue();
	});
}

/**
 *  Create a Github Issue
 */
function createIssue() {
	console.log("Proceeding to create issue from the ticket");
	getTicketDetails(function (ticketData) {
		checkAndCreateIssue(
			ticketData.ticket.id,
			function () {
				// The record already exists - indicates it is already associated with Github issue
				showNotification('warning', 'Hold on 🙅🏻‍♂️', 'A Github issue has been already created for this ticket. Click on \'View Issue Details\' button');
			},
			function (error) {
				//404 - Indicates that the record is not found in the data storage
				if (error.status === 404) {
					createIssueHelper(ticketData);
				}
			})
	}, function (error) {
		console.error("Error occurred while fetching ticket details", error);
	});
}

/**
 *  Function to View issue in the modal, Passes ticket as an object to the modal, can be fetched in the modal using Instance API
 */
function viewIssue() {
	getTicketDetails(function (data) {
		client.interface.trigger("showModal", {
			title: "Github Issue Details",
			template: "./modal/modal.html",
			data: data.ticket
		});
	}, function (error) {
		console.error(error);
	});
}

/**
 * Makes an API call to Github to create an issue from the ticket
 * @param {object} ticketData Ticket data
 */
function createIssueHelper(ticketData) {
	var options = {
		headers: {
			"Authorization": 'token <%= access_token %>',
			"User-Agent": 'FreshHuddle Sample User Agent'
		},
		body: JSON.stringify({
			"title": ticketData.ticket.subject,
			"body": ticketData.ticket.description_text
		}),
		isOAuth: true
	};
	client.request.post(`https://api.github.com/repos/<%= iparam.github_repo %>/issues`, options)
		.then(function (data) {
			// TODO : Add try catch block
			response = JSON.parse(data.response);
			var ticketObj = { ticketID: ticketData.ticket.id, issueID: response.id, issueNumber: response.number };
			setData(ticketObj);
		})
		.catch(function (error) {
			console.error("error", error);
		})
}

/**
 *
 * @param {function} success Callback if the ticket details are fetched successfully
 * @param {function} error Callback if there's an error
 */
function getTicketDetails(success, error) {
	client.data.get('ticket')
		.then(success)
		.catch(error);
}

/**
 * Check if the ticket is already linked to a Github issue. If not, create.
 * @param {Number} ticketID ID of the curent ticket
 * @param {function} issueExistCallback Callback if the issue exists
 * @param {function} issueDoesntExistCallback Callback if the issue doesnt exist
 */
function checkAndCreateIssue(ticketID, issueExistCallback, issueDoesntExistCallback) {
	var dbKey = String(`fdTicket:${ticketID}`).substr(0, 30);
	client.db.get(dbKey)
		.then(issueExistCallback)
		.catch(issueDoesntExistCallback);
}

/**
 * Store Github issue data using data storage API
 * @param {array} data Issue array to be set in data storage
 */
function setData(data) {
	var dbKey = String(`fdTicket:${data.ticketID}`).substr(0, 30);
	var dbKey2 = String(`gitIssue:${data.issueNumber}`).substr(0, 30);
	Promise.all([client.db.set(dbKey, { issue_data: data }), client.db.set(dbKey2, { issue_data: data })]).then(function () {
		showNotification('success', 'Yay 🎉', 'A Github issue is successfully created for this ticket')
	}).catch(function (error) {
		console.error("Unable to persist data : ", error);
	});
}

/**
 * Show notifications to the user using interface - notification API
 * @param {string} type Type of notification
 * @param {string} title Title of the message
 * @param {string} message Content of the notification message
 */
function showNotification(type, title, message) {
	client.interface.trigger("showNotify", {
		type: `${type}`,
		title: `${title}`,
		message: `${message}`
	}).catch(function (error) {
		console.error('Notification Error : ', error);
	});
}
