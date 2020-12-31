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
 * Returns the text and color code associated with a catalog status code. Formatter function
 * @param {string} code Represents the status of cataloging for a particular restaurant. For simplicity sake, 1 -> Open, 2 -> In Progress, 3 -> Complete
 */
function catalogStatus(code) {
  switch (code) {
    case "1":
      return {
        status: "Open", color: "blue"
      };
    case "2":
      return {
        status: "In Progress", color: "yellow"
      };
    case "3":
      return {
        status: "Cataloged", color: "green"
      };
  }
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