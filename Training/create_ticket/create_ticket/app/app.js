
$(document).ready(function () {

	app.initialized()
		.then(function (_client) {
			window.client = _client;
			client.events.on('app.activated',
				function () {
					onLoadClickEventHandler();
				});
		},
			function () {
				showNotification('danger', 'Sorry! unable to load app');
			});



	/**
	 *   Collection of on load Click events 
	 */
	function onLoadClickEventHandler() {

		$('#createTicket').click(function () {
			let title = $('#title').val();				// Ticket title fetched from user Input
			let desc = $('#desc').val();					// Description of the ticket fetched from user input
			let email = $('#email').val();				// Email id of the user, creating the ticket
			if (title && desc && email) {
				CreateFreshdeskTicket(title, desc, email);
			}
			else {
				showNotification('danger', 'Ticket Values cannot empty, Fill all values')
			}
		});
	}


	
	/**
	 * Fucntion to create a freshdesk ticket
	 * @param {String} title 					Ticket title
	 * @param {String} description 		Ticket description
	 * @param {String} email 					email of the user that creates ticket 
	 */
	function CreateFreshdeskTicket(title, description, email) {
		
		client.request.post("https://<%=iparam.freshdesk_subdomain%>.freshdesk.com/api/v2/tickets", {
			headers: {
				Authorization: "Basic <%= encode(iparam.freshdesk_api_key)%>",
				"Content-Type": "application/json;charset=utf-8"
			},

			body: JSON.stringify({
				description: `${description}`,
				email: `${email}`,
				priority: 1,
				status: 2,
				subject: `${title}`
			})
		}).then(function () {
			showNotification('success', 'Ticket is successfully created');
	
			//Clears user input after posting data
			clearInputfields();
		})
			.catch(function () {
				showNotification('danger', 'Unable to create ticket');
			});
	}


	/**
	 * Function to Show user notification
	 * @param {String} status   	Status of the notification
	 * @param {String} message  	Custom notification message 
	 * 
	 */
	function showNotification(status, message) {
		client.interface.trigger("showNotify", {
			type: `${status}`,
			message: `${message}`
		})
	}

	/**
	 * Function to clear all input values after ticket creation
	 */
	function clearInputfields() {		
		$('#title').val('');				
		$('#desc').val('');					
		$('#email').val('');
	}
});
