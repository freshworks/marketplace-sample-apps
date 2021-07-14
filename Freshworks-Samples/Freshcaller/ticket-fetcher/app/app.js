document.addEventListener("DOMContentLoaded", function () {
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
  function clickEventHandler() {
    document.getElementById('get-tickets').addEventListener('click', function () {
      let formVal = document.getElementById('email-ticket').value;
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
          document.getElementById('email-ticket').value = '';
        }
        if (data.email) {
          document.getElementById('email-ticket').value = data.email;
          getTickets(data.email)
        }
      })
      .catch(function (error) {
        console.error('Unable to fetch current caller', error);
      });
  }


  /**
   * Function to get list of tickets from Freshdesk for a specified user
   * @param {String} email  Email id of the user to fetch list of tickets
   */
  function getTickets(email) {
    client.iparams.get('freshdesk_subdomain').then(function (iparam) {
      client.request.get(`https://${iparam.freshdesk_subdomain}.freshdesk.com/api/v2/tickets?email=${email}`, {
        headers: {
          Authorization: "Basic <%= encode(iparam.freshdesk_api_key)%>",
          "Content-Type": "application/json;charset=utf-8"
        }
      }).then(function (data) {
        appendHMTL(JSON.parse(data.response));
      })
        .catch(function (error) {
          console.error('Unable to fetch Tickets from freshdesk', error);
        });
    })
  }


  /**
   * Function to append list of tickets in html
   * @param {String} data  Ticket details to append in html
   */
  function appendHMTL(data) {
    var element = document.getElementById("list-issue")
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }

    let html = `<table class="table"> <thead><tr><th scope="col">#</th><th scope="col">Ticket</th></tr></thead><tbody>`

    data.forEach(data => {
      html += `<tr><td>${data.id}</td><td><a href="https://<%=iparam.freshdesk_subdomain%>.freshdesk.com/a/tickets/${data.id}" target='_blank'>${data.subject}</a></td></tr>`
    });

    html = `${html}<table class="table"></tbody></table>`;

    document.getElementById('list-issue').insertAdjacentHTML('beforeend', html);
  }
});
