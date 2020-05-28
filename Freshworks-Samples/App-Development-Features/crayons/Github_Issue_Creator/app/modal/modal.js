$(document).ready(function () {
	app.initialized()
		.then(function (_client) {
			window.client = _client;
			client.data.get('ticket')
				.then(
					function (data) {
						onModalLoad(data.ticket);
					},
					function () {
						showNotification(`error`, `Sorry 🎉`)
					})
		});
});



/**
 * Function that is triggered on Modal load.
 * @param {object} ticket  ticket that is fetched from parent
 */
function onModalLoad(ticket) {

	var ticketID = ticket.id;
	getIssue(ticketID, function (data) {
		console.log('data', data);
		issueNumber = data.issue_data.issueNumber;
		fetchIssue(issueNumber);
	});
}

/**
 * Retrieve the issue from data storage
 * @param {Number} ticketID Ticket ID
 * @param {function} callback Callback function
 */
function getIssue(ticketID, callback) {
	var dbKey = String(`fdTicket:${ticketID}`).substr(0, 30);
	client.db.get(dbKey)
		.then(
			callback)
		.catch(function (error) {

			//404 - Indicates that the record is not found in the data storage
			if (error.status === 404) {
				console.error("No issue found for ticket", error);
				var html = '';
				html = `<div class="alert alert-warning" role="alert">
                  <img src="https://media.tenor.com/images/a48310348e788561dc238b6db1451264/tenor.gif" width="120px"/>
                  <hr>
                  Seems like there's no issue associated with this ticket. Please created one using 'Create Issue' button
                </div>`;
				$('#modal').append(html);
			}
		})
}

/**
 * Function to fecth issue from github, authorization is done using Oauth
 * @param {string} issueID  Issue number to query specific  ticket from github
 */
function fetchIssue(issueID) {
	var options = {
		headers: {
			Authorization: 'token <%= access_token %>',
			'User-Agent': 'FreshHuddle Sample User Agent'
		},
		isOAuth: true
	};
	client.request.get(`https://api.github.com/repos/<%= iparam.github_repo %>/issues/${issueID}`, options)
		.then(function (data) {
			try {
				data = JSON.parse(data.response);
				var html = '';
				html = `<h3> Issue title : ${data.title} </h3><p>Description : ${data.body}</p> <p> Issue Number : ${data.number}</p> <p>Issue ID ; ${data.id}</p><p> Issue Status : ${data.state}</p>`;
				$('#modal').append(html);
			} catch (error) {
				console.error("Error while attempting to show issue", error);
			}
		})
		.catch(function (error) {
			console.error("error", error);
		});
}

/**
 * Function to create Issue in Github
 */
function createIssue() {
	console.log("Proceeding to create issue from the ticket");
	getTicketDetails(function (ticketData) {
		console.log('ticketData', ticketData);

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
			console.log('ticketData', ticketData);
			response = JSON.parse(data.response);
			var ticketObj = { ticketID: ticketData.ticket.id, issueID: response.id, issueNumber: response.number };
			console.log('ticket obj', ticketObj);

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
