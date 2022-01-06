'use strict';
/**
 * App Initializer
 */
var listData;
var memberData;

document.addEventListener("DOMContentLoaded", function () {
	app.initialized()
		.then(function (_client) {
			window.client = _client;
			checkStatus();
			getList();
			getMembers();
			registerClickEventHandlers();
			client.instance.receive(
				function (event) {
					var data = event.helper.getData();
					showNotification("success", data.message);
				}
			);
		})
		.catch(function (error) {
			console.error('Error during initialization', error);
		});

});

function checkStatus() {
	getTicketDetails(function (ticketData) {
		let due = new Date(ticketData.ticket.due_by);
		due = String(due).substring(0, 15);
		checkAndCreateCard(
			ticketData.ticket.id,
			function (data) {
				// The record already exists - indicates it is already associated with trello card
				let value1 = "Ticket - " + data.card_data.ticketID + " is linked to a Card! Due by : " + due;
				$("#status").append('<label>' + value1 + '</label>');
			},
			function () {
				//404 - Indicates that the record is not found in the data storage
				let value2 = "No Card Linked Yet!"
				$("#status").append('<label>' + value2 + '</label>');
			})
	}, function (error) {
		console.error("Error occurred while fetching ticket details", error);
	});
}

function getList() {
	client.request.invoke("getListSMI", {}).then(
		function (data) {
			// data is a json object with requestID and response.
			// The serverless environment generates the request ID.
			// The serverless method in server.js returns two objects (error,response).
			// data.response is the response object from the serverless method.
			console.log("Server method Request ID is: " + data.requestID);
			listData = data.response;
		},
		function (err) {
			// err is a json object with requestID, status, and message.
			// The serverless environment generates the request ID.
			// The serverless method in server.js returns two objects (error,response).
			// The error object contains the status and message attributes.
			// err.status is the error.status attribute.
			// err.message is the error.message attribute.
			console.log("Request ID: " + err.requestID);
			console.log("error status: " + err.status);
			console.log("error message: " + err.message);
		});
}

function getMembers() {
	client.request.invoke("getMemberSMI", {}).then(
		function (data) {
			// data is a json object with requestID and response.
			// The serverless environment generates the request ID.
			// The serverless method in server.js returns two objects (error,response).
			// data.response is the response object from the serverless method.
			console.log("Server method Request ID is: " + data.requestID);
			memberData = data.response;
		},
		function (err) {
			// err is a json object with requestID, status, and message.
			// The serverless environment generates the request ID.
			// The serverless method in server.js returns two objects (error,response).
			// The error object contains the status and message attributes.
			// err.status is the error.status attribute.
			// err.message is the error.message attribute.
			console.log("Request ID: " + err.requestID);
			console.log("error status: " + err.status);
			console.log("error message: " + err.message);
		});
}

/**
 * Register the click event handlers for `Create Card` , `View Card` and `Delete Card` buttons
 */
function registerClickEventHandlers() {
	document.getElementById('createCard').addEventListener('click', function () {
		createCard();
	});

	document.getElementById('viewCard').addEventListener('click', function () {
		viewCard();
	});

	document.getElementById('deleteCard').addEventListener('click', function () {
		deleteCard();
	});
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
 *  Create a Trello Card
 */
function createCard() {
	console.log("Proceeding to create card from the ticket");
	getTicketDetails(function (ticketData) {
		//console.log(ticketData);
		checkAndCreateCard(
			ticketData.ticket.id,
			function () {
				// The record already exists - indicates it is already associated with trello card
				showNotification('info', 'A Trello Card has been already created for this ticket. Click on \'View Card\' button');
			},
			function (error) {
				//404 - Indicates that the record is not found in the data storage
				if (error.status === 404) {
					createCardHelper(ticketData);
				}
			})
	}, function (error) {
		console.error("Error occurred while fetching ticket details", error);
	});
}



/**
 * Check if the ticket is already linked to a Trello card. If not, create.
 * @param {Number} ticketID ID of the curent ticket
 * @param {function} cardExistCallback Callback if the card exists
 * @param {function} cardDoesntExistCallback Callback if the card doesnt exist
 */
function checkAndCreateCard(ticketID, cardExistCallback, cardDoesntExistCallback) {
	var dbKey = String(`fdTicket:${ticketID}`).substring(0, 30);
	console.log(dbKey);
	client.db.get(dbKey)
		.then(cardExistCallback)
		.catch(cardDoesntExistCallback);
}


/**
 * Function to Create card in the modal, Passes ticket data as an object to the modal, can be fetched in the modal using Instance API
 * @param {object} ticketData Ticket data
 */
function createCardHelper(ticketData) {
	let tData = {
		ticketId: ticketData.ticket.id,
		desc: ticketData.ticket.description_text,
		sub: ticketData.ticket.subject,
		priority: ticketData.ticket.priority_label,
		date: ticketData.ticket.due_by,
		list: listData,
		member: memberData
	}
	client.interface.trigger("showModal", {
		title: "Create a Card",
		template: "modal/createModal.html",
		data: tData
	}).then(function (data) {
		// data - success message
		console.log("in Create model");
		console.info(data);
	}).catch(function (error) {
		// error - error object
		console.error(error);
	});

}

/**
 *  Function to View card in the modal, Passes ticket id as an object to the modal, can be fetched in the modal using Instance API
 */
function viewCard() {
	console.log("Proceeding to view card from the ticket");
	getTicketDetails(function (data) {
		client.interface.trigger("showModal", {
			title: "Linked Card",
			template: "modal/viewModal.html",
			data: data.ticket.id
		}).then(function (data) {
			// data - success message
			console.log("in View model");
			console.info(data);
		}).catch(function (error) {
			// error - error object
			console.error(error);

		});
	})
}

/**
 *  Delete the trello card
 */
function deleteCard() {
	console.log("Proceeding to delete card from the ticket");
	getTicketDetails(function (ticketData) {
		checkAndCreateCard(
			ticketData.ticket.id,
			function () {
				// The record already exists - indicates it is already associated with trello card
				deleteCardHelper(ticketData);
			},
			function (error) {
				//404 - Indicates that the record is not found in the data storage
				if (error.status === 404) {
					showNotification('info', 'No Card exist for this ticket. Click on \'Create Card\' button');
				}
			})
	}, function (error) {
		console.error("Error occurred while fetching ticket details", error);
	});

}

function getCard(ticketID, callback) {
	var dbKey = String(`fdTicket:${ticketID}`).substring(0, 30);
	client.db.get(dbKey)
		.then(callback)
		.catch(function (error) {
			//404 - Indicates that the record is not found in the data storage
			if (error.status === 404) {
				console.error("No Card found for the ticket", error);
			}
		})
}

function deleteCardHelper(ticketInfo) {
	var Data = ticketInfo.ticket.id;
	getCard(Data, function (data) {
		let cardData = data.card_data.cardID;
		let ticketData = data.card_data.ticketID;
		removeCard(cardData, ticketData);
	});
}

function removeCard(cardID, ticketId) {
	let options = {
		"cardID": cardID,
	}
	client.request.invoke("deleteCardSMI", options).then(
		function (data) {
			// data is a json object with requestID and response.
			// The serverless environment generates the request ID.
			// The serverless method in server.js returns two objects (error,response).
			// data.response is the response object from the serverless method.
			console.log("Server method Request ID is: " + data.requestID);
			console.info("card deleted")
			removeData(cardID, ticketId);
		},
		function (err) {
			// err is a json object with requestID, status, and message.
			// The serverless environment generates the request ID.
			// The serverless method in server.js returns two objects (error,response).
			// The error object contains the status and message attributes.
			// err.status is the error.status attribute.
			// err.message is the error.message attribute.
			console.log("Request ID: " + err.requestID);
			console.log("error status: " + err.status);
			console.log("error message: " + err.message);
		});
}

function removeData(cardID, ticketID) {
	var dbKey1 = String(`fdTicket:${ticketID}`).substring(0, 30);
	var dbKey2 = String(`trelloCard:${cardID}`).substring(0, 30);
	Promise.all([client.db.delete(dbKey1), client.db.delete(dbKey2)]).then(
		function (data) {
			// success operation
			// "data" value is { "Deleted" : true }
			showNotification('success', 'Trello card for this ticket is deleted successfully');
			console.log(data);
		},
		function (error) {
			console.log(error);
			// failure operation
		});
}


/**
 * Function to show notifications to the user
 * @param {String} type  	Status of the notification
 * @param {String} message  	Custom notification message
 * */
function showNotification(type, message) {
	client.interface.trigger("showNotify", {
		type: `${type}`,
		message: `${message}`
	}).catch(function (error) {
		console.error('Notification Error : ', error);
	});
}
