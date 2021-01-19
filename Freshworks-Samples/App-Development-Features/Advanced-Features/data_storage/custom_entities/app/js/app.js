/**
 * Initialize the calendar
 * Obtain references to `restaurant` & `appointment` entities 
 * Handle messages passed from modals & update the view
 */
document.addEventListener('DOMContentLoaded', function () {
  initializeCalendar();
  app.initialized().then(function (client) {
    window.client = client;
    window.restaurant = getEntity("restaurants");
    window.appointment = getEntity("appointments");
    handleInstanceInteractions();
    updateView();
  });
});

/**
 * Shows the new restaurant modal
 */
function showNewRestaurantModal() {
  client.interface.trigger("showModal", {
      title: "Add Restaurant",
      template: "./modal/restaurant.html"
    })
    .catch(function (error) {
      notify("danger", "Something went wrong while opening the restaurant modal")
      console.error(error);
    });
}

/**
 * Obtains reference to the entity via its name
 * @param {string} entityName 
 */
function getEntity(entityName) {
  var entity = client.db.entity({
    version: 'v1'
  });
  var entityRef = entity.get(entityName);
  entityRef.schema()
    .then(function (schema) {
      return entityRef;
    })
    .catch(function (error) {
      notify("danger", `Error occurred while obtaining reference to '${entityName}' entity`);
      console.error(error);
      return null;
    })
}

/**
 * Load all restaurants from the custom entity, `restaurants`
 */
function loadRestaurants() {
  restaurant.getAll()
    .then(function (data) {
      $("#restaurant_list").html(generateRestaurantList(data.records));
    })
    .catch(function (error) {
      notify("danger", "Something went wrong while loading the restaurants");
      console.error(error);
    })
}

/**
 * Load all appointments from the custom entity, `appointments`
 * @param {function} callback - Pass the appointments through a callback required by the calendar
 */
function loadAppointments(callback) {
  if (typeof client != "undefined") {
    client.iparams.get().then(function (iparam) {
      appointment.getAll().then(function (data) {
        var events = data.records.map(function (appointment) {
          return createCalendarEventObj(appointment, iparam.domain);
        });
        callback(events);
      }).catch(function (error) {
        notify("danger", "Something went wrong while loading all the appointments");
        console.error(error);
      })
    }).catch(function (error) {
      notify("danger", "Something went wrong while retrieving the installation parameters");
      console.error(error);
    })
  } else {
    callback([]);
  }
}

/**
 * Populate the list of records in the UI
 * @param {array} records - List of records
 */
function generateRestaurantList(records) {
  return records.map(function (restaurant) {
    return `<li class="list-group-item">
            <div class="row">
              <div class="col-sm-3">
                <img src='${restaurant.data.photo_url ? restaurant.data.photo_url: "https://i.imgur.com/ZyONF7N.png" }' style='min-width: 100px;' width="100px" height="100px" />
              </div>
              <div class="col-sm-6 ml-2" style='min-width: 350px;' >
                <h4>${restaurant.data.name}</h4>
                <b> ${restaurant.display_id}</b>
                <p>${restaurant.data.description} ...</p>
                <a href="#">
                    <fw-label value="${ catalogStatus(restaurant.data.status).status }" color="${ catalogStatus(restaurant.data.status).color }"></fw-label>
                    <fw-button size="mini" style="display:${ restaurant.data.status == '1' ? 'inline': 'none' }" color="secondary" onclick='deleteRestaurant("${restaurant.display_id}","${ escape(restaurant.data.name) }")'> Delete </fw-button>
                </a>
              </div>
              <div class="col-sm-3">

              </div>
            </div>
            </li>`
  }).join("");
}

/**
 * Filter the restaurant list by constructing a query
 */
function filterRestaurants() {
  var short_code = document.getElementById("short_code_in").value;
  var status = document.getElementById("catalog_in").value;
  var qs = {},
    queryObj = {},
    getAllRestaurants;
  // Check if short code has a value
  if (short_code.length)
    queryObj = Object.assign({}, queryObj, {
      short_code
    })
  // Check if a status value is selected
  if (status != "0")
    queryObj = Object.assign({}, queryObj, {
      status
    })
  // Query object is a simple key value pair if its just one field to filter upon
  if (queryObj && Object.keys(queryObj).length == 0) {
    getAllRestaurants = restaurant.getAll();
  } else
  if (Object.keys(queryObj).length == 1) {
    qs = {
      query: queryObj
    };
    getAllRestaurants = restaurant.getAll(qs)
  } else
  if (Object.keys(queryObj).length > 1) {
    var inObj = Object.keys(queryObj).map((i) => {
      return {
        [i]: queryObj[i]
      };
    });
    qs = {
      query: {
        $and: inObj
      }
    };
    getAllRestaurants = restaurant.getAll(qs)
  }
  getAllRestaurants.then(function (data) {
    $("#restaurant_list").html(generateRestaurantList(data.records));
  });
}

/**
 * Delete a restaurant based on its ID
 * @param {string} id - ID of the record
 * @param {string} name - Human readable name of the restaurant
 */
function deleteRestaurant(id, name) {
  client.interface.trigger("showConfirm", {
    title: "Delete " + unescape(name) + " ?",
    message: "Note: You also cannot delete restaurants if they already have appointments",
    saveLabel: "Delete"
  }).then(function (action) {
    if (action.message == "Delete") {
      restaurant.delete(id);
      notify("success", `Restaurant - ${ unescape(name) } deleted successfully`);
      updateView();
    }
  }).catch(function (error) {
    console.error(error);
    client.instance.close();
  });
}
