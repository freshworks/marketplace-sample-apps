document.addEventListener("DOMContentLoaded", appInitialized);

function appInitialized() {
  app.initialized().then((_client) => {
    window.client = _client;
    client.events.on("app.activated", appActivated);
  });
}
/**
 * Show a notification toast with a given message
 * @param {string} type - type of the notification
 * @param {string} message - content to be shown on the notification
 */
function notify(type, message) {
  client.interface.trigger("showNotify", {
    type: type,
    message: message,
  });
}

function appActivated() {
  //getting ticket data
  client.data.get("ticket").then(
    (data) => {
      var { ticket: ticketData } = data;
      storeInteraction(ticketData);
    },
    (error) => {
      notify("danger", "Error while fetching ticket details");
      console.error(error, "Error while fetching ticket details");
    }
  );
}
/**
 * Store interaction in db with ticket id as key
 * @param {object} ticketData - contains ticket information
 */
function storeInteraction(ticketData) {
  client.db
    .set(
      `ticket: ${ticketData.id}`,
      { interaction_noted: true },
      { setIf: "not_exist" }
    )
    .then(
      () => {
        updateInteraction(ticketData.requester_id);
        getLoggedUserData(ticketData.requester_id);
      },
      (error) => {
        notify(
          "warning",
          "Interaction has already been stored for this ticket"
        );
        console.error(
          error,
          "Interaction has already been stored for this ticket"
        );
      }
    );
}
/**
 * Update the customer interaction count
 * @param {Integer} requesterId - id of the requester (customer)
 */
function updateInteraction(requesterId) {
  client.db.update(requesterId, "increment", { Interactions: 1 }).then(
    () => {
      notify("success", "Interaction stored successfully");
    },
    (error) => {
      notify("danger", "Error in storing interaction");
      console.error(error, "Error in stporing interaction");
    }
  );
}
/**
 * Getting logged in user details (agent)
 * @param {Integer} requesterId - id of the requester (customer)
 */
function getLoggedUserData(requesterId) {
  client.data.get("loggedInUser").then(
    (data) => {
      var { loggedInUser: loggedUserData } = data;
      getAssociatedCustomers(loggedUserData.id, requesterId);
    },
    (error) => {
      notify("danger", "Error while fetching logged user data");
      console.error(error, "Error while fetching logged user data");
    }
  );
}
/**
 * fetching all the customers associated with this agent
 * @param {Integer} agentId - id of the agent
 * @param {Integer} requesterId - id of the customer
 */
function getAssociatedCustomers(agentId, requesterId) {
  client.db.get(`agent_id: ${agentId}`).then(
    (data) => {
      associateCustomer(agentId, requesterId, data["associated_customers"]);
    },
    (error) => {
      console.error(error, "No customers associated");
      appendCustomerToAgent(agentId, requesterId);
    }
  );
}
/**
 * Checking, if the customer is already associated with the agent
 * @param {Integer} agentId - id of the agent
 * @param {Integer} requesterId - id of the customer
 * @param {Array} associatedCustomers - array of customers, associated with the agent
 */
function associateCustomer(agentId, requesterId, associatedCustomers) {
  if (associatedCustomers.indexOf(requesterId) === -1) {
    appendCustomerToAgent(agentId, requesterId);
  } else {
    notify("warning", "Customer has already been associated");
  }
}
/**
 * Associate customer to the agent by updating the db
 * @param {Integer} agentId - id of the agent
 * @param {Integer} requesterId - id of the customer
 */
function appendCustomerToAgent(agentId, requesterId) {
  client.db
    .update(`agent_id: ${agentId}`, "append", {
      associated_customers: [requesterId],
    })
    .then(
      () => {
        notify("success", "Customer associated successfully");
      },
      (error) => {
        notify("danger", "Error while associating customer");
        console.error(error, "Error while associating customer");
      }
    );
}
