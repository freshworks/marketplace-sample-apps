/**
 * Enum for Catalog Status
 */
const CATALOG_STATUS = {
  "1": {
    status: "Open",
    color: "blue"
  },
  "2": {
    status: "In Progress",
    color: "yellow"
  },
  "3": {
    status: "Cataloged",
    color: "green"
  }
}

/**
 * The modal or dialog can communicate with the parent to send out notifications or perform other tasks 
 */
function handleInstanceInteractions() {
  client.instance.receive(
    function (event) {
      var data = event.helper.getData();
      switch (data.message.action) {
        case "notification": {
          notify(data.message.type, data.message.message);
          updateView();
          break;
        }
      }
    }
  );
}

/**
 * This function returns a color hash code that is specific to a restaurant. This is to paint them in the same color in the calendar views
 * @param {string} str A string value which is usually a restaurant name or ID in this case
 */
function hashCode(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

/**
 * Refreshes the restaurant list and also the calendar
 */
function updateView() {
  loadRestaurants();
  calendar.refetchEvents();
}

/**
 * Displays a notification
 * @param {string} type Type of notification
 * @param {string} message The message to display in the notification
 */
function notify(type, message) {
  client.interface.trigger("showNotify", {
    type: type,
    message: message
  });
}
