$(document).ready(function () {
	app.initialized()
		.then(function (_client) {
			window.client = _client;
			client.events.on('app.activated', function () {
				onLoadClickEventHandler();
			});
		})
		.catch(function (error) {
			console.error(error);
			showNotification('danger', 'Sorry! Unable to load app');
		});
});

/**
 *   Register click event handler for `Create Ticket` button
 */
function onLoadClickEventHandler() {
	$('#createTicket').click(function () {
		var title = $('#title').val();				// Ticket title fetched from user Input
		var desc = $('#desc').val();					// Description of the ticket fetched from user input
		var email = $('#email').val();				// Email id of the user, creating the ticket
		if (title && desc && email) {
			createFreshdeskTicket(title, desc, email);
		} else {
			showNotification('danger', 'Ticket Values cannot empty, Fill all values');
		}
	});
}

// createFreshdeskTicket() function goes here 


/**
 * Function to show notifications to the user
 * @param {String} status   	Status of the notification
 * @param {String} message  	Custom notification message 
 */
function showNotification(status, message) {
	client.interface.trigger("showNotify", {
		type: `${status}`,
		message: `${message}`
	});
}

/**
 * Clear the input fields
 */
function clearInputfields() {
	$('#title').val('');
	$('#desc').val('');
	$('#email').val('');
}

