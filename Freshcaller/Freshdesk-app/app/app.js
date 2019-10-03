$(document).ready(function () {
	app.initialized()
		.then(function (_client) {
			window.client = _client;
			client.events.on('app.activated',
				function () {
					clickEventHandler();
					setUserEmail();
				});
		});


		/**
		 * Collection of click events
		 */
		function  clickEventHandler(){
			$('#get-tickets').on('click', function () {
				let formVal = $('#email-ticket').val();
				getTickets(formVal);
			})
		}

		/**
		 * Function to set Current User email in the form 
		 */
		function setUserEmail() {
			client.data.get('currentCaller')
			.then(function (data) {
				if (!data.email) {
					$('#email-ticket').val('')
				}
				if (data.email) {
					$('#email-ticket').val(data.email)
					getTickets(data.email)
				}
			})
			.catch(function (e) {
				console.error('Exception - ', e);
			});
		}


		/**
		 * Function to get list of tickets from Freshdesk for a specified user 
		 * @param {String} email  Email id of the user to fetch list of tickets
		 */
		function getTickets(email) {
			client.request.get(`https://<%=iparam.freshdesk_subdomain%>.freshdesk.com/api/v2/tickets?email=${email}`, {
				headers: {
					Authorization: "Basic <%= encode(iparam.freshdesk_api_key)%>",
					"Content-Type": "application/json;charset=utf-8"
				}
			}).then(function (data) {
				appendHMTL(JSON.parse(data.response));
			})
				.catch(function (error) {
					console.error('error', error);
				});
		}


		/**
		 * Function to append list of tickets in html
		 * @param {String} data  Ticket details to append in html
		 */
		function appendHMTL(data) {

			$('#list-issue').empty()
			let html = `<table class="table"> <thead><tr><th scope="col">#</th><th scope="col">Ticket</th></tr></thead><tbody>`

			data.forEach(data => {
				html += `<tr><td>${data.id}</td><td><a href="https://<%=iparam.freshdesk_subdomain%>.freshdesk.com/a/tickets/${data.id}" target='_blank'>${data.subject}</a></td></tr>`
			});
			
				html = `${html}<table class="table"></tbody></table>`;

			 $('#list-issue').append(html);
		}
});
