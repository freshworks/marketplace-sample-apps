'use strict';

/**
 * App Initializer
 */

let listData;
let memberData;

document.addEventListener("DOMContentLoaded", function () {
	app.initialized()
		.then(function (_client) {
			window.client = _client;
			checkStatus();
			client.events.on('app.activated', getList);
			client.instance.receive(
				function (event) {
					let data = event.helper.getData();
					showNotification("success", data.message);
				}
			);
		})
		.catch(function (error) {
			console.error('Error during initialization');
			console.error(error);
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
				document.getElementById('status').insertAdjacentHTML('beforeend', `<label> ${value1} </label>`);

			},
			function () {
				//404 - Indicates that the record is not found in the data storage
				let value2 = "No Card Linked Yet!"
				document.getElementById('status').insertAdjacentHTML('beforeend', `<label> ${value2} </label>`);

			})
	}, function (error) {
		console.error("Error occurred while fetching ticket details");
		console.error(error);
	});
}

async function getList() {
	getMembers();
	registerClickEventHandlers();
	try {
		// data is a json object with requestID and response.
		// The serverless environment generates the request ID.
		// The serverless method in server.js returns two objects (error,response).
		// data.response is the response object from the serverless method.
		let data = await client.request.invoke("getListSMI", {});
		listData = data.response;
		console.info("Server method Request ID is: " + data.requestID);

	} catch (err) {
		// err is a json object with requestID, status, and message.
		// The serverless environment generates the request ID.
		// The serverless method in server.js returns two objects (error,response).
		// The error object contains the status and message attributes.
		// err.status is the error.status attribute.
		// err.message is the error.message attribute.
		console.info("Request ID: " + err.requestID);
		console.error("error status: " + err.status);
		console.error("error message: " + err.message);
	}
}

async function getMembers() {
	try {
		// data is a json object with requestID and response.
		// The serverless environment generates the request ID.
		// The serverless method in server.js returns two objects (error,response).
		// data.response is the response object from the serverless method.
		let data = await client.request.invoke("getMemberSMI", {});
		memberData = data.response;
		console.info("Server method Request ID is: " + data.requestID);

	} catch (err) {
		// err is a json object with requestID, status, and message.
		// The serverless environment generates the request ID.
		// The serverless method in server.js returns two objects (error,response).
		// The error object contains the status and message attributes.
		// err.status is the error.status attribute.
		// err.message is the error.message attribute.
		console.info("Request ID: " + err.requestID);
		console.error("error status: " + err.status);
		console.error("error message: " + err.message);
	}
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
	console.info("Proceeding to create card from the ticket");
	getTicketDetails(function (ticketData) {
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
		console.error("Error occurred while fetching ticket details");
		console.error(error);
	});
}



/**
 * Check if the ticket is already linked to a Trello card. If not, create.
 * @param {Number} ticketID ID of the curent ticket
 * @param {function} cardExistCallback Callback if the card exists
 * @param {function} cardDoesntExistCallback Callback if the card doesnt exist
 */
function checkAndCreateCard(ticketID, cardExistCallback, cardDoesntExistCallback) {
	let dbKey = String(`fdTicket:${ticketID}`).substring(0, 30);
	console.info(dbKey);
	client.db.get(dbKey)
		.then(cardExistCallback)
		.catch(cardDoesntExistCallback);
}


/**
 * Function to Create card in the modal, Passes ticket data as an object to the modal, can be fetched in the modal using Instance API
 * @param {object} ticketData Ticket data
 */
async function createCardHelper(ticketData) {
	let tData = {
		ticketId: ticketData.ticket.id,
		desc: ticketData.ticket.description_text,
		sub: ticketData.ticket.subject,
		priority: ticketData.ticket.priority_label,
		date: ticketData.ticket.due_by,
		list: listData,
		member: memberData
	}
	await client.interface.trigger("showModal", {
		title: "Create a Card",
		template: "modal/createModal.html",
		data: tData
	});
	console.info("In Create Modal");

}

/**
 *  Function to View card in the modal, Passes ticket id as an object to the modal, can be fetched in the modal using Instance API
 */
function viewCard() {
	console.info("Proceeding to view card from the ticket");
	getTicketDetails(async function (data) {
		await client.interface.trigger("showModal", {
			title: "Linked Card",
			template: "modal/viewModal.html",
			data: data.ticket.id
		});
	})
	console.info("in View model");
}

/**
 *  Delete the trello card
 */
function deleteCard() {
	console.info("Proceeding to delete card from the ticket");
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
		console.error("Error occurred while fetching ticket details");
		console.error(error);
	});

}

function getCard(ticketID, callback) {
	let dbKey = String(`fdTicket:${ticketID}`).substring(0, 30);
	client.db.get(dbKey)
		.then(callback)
		.catch(function (error) {
			//404 - Indicates that the record is not found in the data storage
			if (error.status === 404) {
				console.error("No Card found for the ticket");
				console.error(error);
			}
		})
}

function deleteCardHelper(ticketInfo) {
	let tId = ticketInfo.ticket.id;
	getCard(tId, function (data) {
		let cardData = data.card_data.cardID;
		let ticketData = data.card_data.ticketID;
		removeCard(cardData, ticketData);
	});
}

async function removeCard(cardID, ticketId) {
	try {
		// data is a json object with requestID and response.
		// The serverless environment generates the request ID.
		// The serverless method in server.js returns two objects (error,response).
		// data.response is the response object from the serverless method.
		let options = {
			"cardID": cardID,
		}
		await client.request.invoke("deleteCardSMI", options);
		console.info("card deleted")
		removeData(cardID, ticketId);
	} catch (err) {
		// err is a json object with requestID, status, and message.
		// The serverless environment generates the request ID.
		// The serverless method in server.js returns two objects (error,response).
		// The error object contains the status and message attributes.
		// err.status is the error.status attribute.
		// err.message is the error.message attribute.
		console.info("Request ID: " + err.requestID);
		console.error("error status: " + err.status);
		console.error("error message: " + err.message);
	}
}

async function removeData(cardID, ticketID) {
	let dbKey1 = String(`fdTicket:${ticketID}`).substring(0, 30);
	let dbKey2 = String(`trelloCard:${cardID}`).substring(0, 30);
	await Promise.all([client.db.delete(dbKey1), client.db.delete(dbKey2)]);
	showNotification('success', 'Trello card for this ticket is deleted successfully');

}


/**
 * Function to show notifications to the user
 * @param {String} type  	Status of the notification
 * @param {String} message  	Custom notification message
 * */
async function showNotification(type, message) {
	await client.interface.trigger("showNotify", {
		type: `${type}`,
		message: `${message}`
	});
}
