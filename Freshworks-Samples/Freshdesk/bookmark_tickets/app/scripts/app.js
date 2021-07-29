document.onreadystatechange = function () {
  if (document.readyState === "interactive") renderApp();

  function renderApp() {
    const onInit = app.initialized();

    onInit.then(getClient).catch(handleErr);

    function getClient(_client) {
      window.client = _client;
      client.events.on("app.activated", onAppActivate);

      client.instance.resize({ height: "500px" });
    }
  }
};

function onAppActivate() {
  showBookmarkedTickets();
}

function showBookmarkedTickets() {
  client.data.get("domainName").then(
    function (freshdeskDomain) {
      console.log("Freshdesk domain is " + freshdeskDomain);
      getLoggedInUser().then(function (loggedInUser) {
        let data = {
          agentId: loggedInUser.id,
        };
        console.log(
          "Getting the bookmarked tickets for agent id " + loggedInUser.id
        );

        client.request.invoke("getBookmarkedTickets", data).then(
          function (response) {
            console.log("Tickets received from the backend are");
            console.log(response.response.savedTickets);

            const agentBookmarkedTicketsTable = document.getElementById(
              "agentBookmarkedTicketsTable"
            );

            // Don't show ticket table if there are no tickets to display
            if (
              response.response.savedTickets == null ||
              response.response.savedTickets.length === 0
            ) {
              agentBookmarkedTicketsTable.style.display = "none";
              return;
            }

            // As there are tickets to be displayed, make the table visible
            agentBookmarkedTicketsTable.style.display = "table";

            // Clear existing rows except headers
            const rowCount = agentBookmarkedTicketsTable.rows.length;
            for (let x = rowCount - 1; x > 0; x--) {
              agentBookmarkedTicketsTable.deleteRow(x);
            }

            response.response.savedTickets.forEach((ticket) => {
              insertRow(
                freshdeskDomain.domainName,
                ticket.ticketId,
                ticket.ticketSubject
              );
            });
          },
          function (error) {
            console.error(
              "Error occurred while getting agent tickets " +
                JSON.stringify(error)
            );
            document.innerHTML = "Unable to get agent tickets";
          }
        );
      });
    },
    function (error) {
      console.error("Unable to get freshworks domain" + JSON.stringify(error));
      document.innerHTML = "Unable to show the tickets";
    }
  );
}

function insertRow(freshdeskDomainName, ticketId, ticketSubject) {
  const table = document
    .getElementById("agentBookmarkedTicketsTable")
    .insertRow(1);

  const c1 = table.insertCell(0);
  const c2 = table.insertCell(1);
  const c3 = table.insertCell(2);

  c1.innerHTML =
    '<a target="blank" href="https://' +
    freshdeskDomainName +
    "/a/tickets/" +
    ticketId +
    '">' +
    ticketId +
    "</a>";
  c2.innerHTML = ticketSubject;
  c3.innerHTML =
    '<input id="' +
    ticketId +
    '" type="image" src="styles/images/removeRed.svg" style="height:20px; width:20px" onClick="removeTicket(this);"/>';
}

function bookmarkTicket() {
  getLoggedInUser().then(function (loggedInUser) {
    getCurrentTicket().then(function (ticket) {
      let data = {
        agentId: loggedInUser.id,
        ticketId: ticket.id,
        ticketSubject: ticket.subject,
      };

      console.log("Saving current ticket with data " + JSON.stringify(data));

      client.request.invoke("bookmarkTicket", data).then(
        function (data) {
          console.info("Successfully saved the agent ticket");
          console.log(data);

          showBookmarkedTickets();
        },
        function (err) {
          console.error("Error while saving ticket");
          console.error(err);
        }
      );
    });
  });
}

function removeTicket(ticket) {
  getLoggedInUser().then(function (loggedInUser) {
    let data = {
      agentId: loggedInUser.id,
      ticketId: parseInt(ticket.id),
    };
    console.info("Removing the agent ticket with data " + JSON.stringify(data));
    client.request.invoke("removeAgentsTicket", data).then(
      function (data) {
        console.log(
          "Successfully removed the ticket from agent. Response is :"
        );
        console.log(data);

        showBookmarkedTickets();
      },
      function (err) {
        console.error("Error while saving ticket");
        console.error(err.message);
      }
    );
  });
}

function getLoggedInUser() {
  return client.data.get("loggedInUser").then(
    function (response) {
      return response.loggedInUser;
    },
    function (error) {
      console.error(
        "Error while getting logged in user" + JSON.stringify(error)
      );
    }
  );
}

function getCurrentTicket() {
  return client.data.get("ticket").then(
    function (data) {
      return data.ticket;
    },
    function (error) {
      // failure operation
      console.error(
        "Error while fetching ticket details " + JSON.stringify(error)
      );
    }
  );
}

function handleErr(err) {
  console.error(`Unable to show agent's saved tickets`, err);
}
