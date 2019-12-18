/**
 * App Initializer
 */
$(document).ready(function () {
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
	$('#createIssue').click(function () {
		createIssue();
	});

	$('#viewIssue').click(function () {
		viewIssue();
	});
}


// createIssue() function goes here 



// createIssueHelper(ticketData) function goes here



// viewIssue() Function goes here 




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


// setData(data) Function goes here 




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
