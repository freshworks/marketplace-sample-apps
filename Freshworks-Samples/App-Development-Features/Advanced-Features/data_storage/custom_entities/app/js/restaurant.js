/**
 * Obtain reference to the 'restaurants' entity
 **/
document.addEventListener('DOMContentLoaded', function () {
  app.initialized().then(function (client) {
    window.client = client;
    var entity = client.db.entity({
      version: 'v1'
    });
    window.restaurant = entity.get("restaurants");
    client.instance.resize({
      height: "425px"
    });
  });
});
/**
 * Create a restaurant 
 **/
function createRestaurant() {
  var newRestaurant = {
    name: getValueOf("name"),
    short_code: getValueOf("short_code"),
    description: getValueOf("description"),
    photo_url: getValueOf("photo_url"),
    location_pin: getValueOf("location_pin"),
    status: "1"
  }
  // Field Validations
  var emptyFields = !Object.values(newRestaurant).every(function (field) {
    return field.length;
  });
  if (emptyFields) {
    document.querySelector('#type_toast').trigger({
      type: 'error',
      content: 'Check if all fields are filled'
    });
    return;
  }
  // Create the restaurant
  restaurant.create(newRestaurant)
    .then(function (data) {
      // Close the instance and show success popup. Repopulate the entries in the list
      client.instance.send({
        message: {
          action: "notification",
          type: "success",
          message: "Restaurant added successfully!"
        }
      });
      client.instance.close();
    })
    .catch(function (error) {
      // Show the error alone 
      document.querySelector('#type_toast').trigger({
        type: 'error',
        content: 'Something went wrong. Creation failed with the following error "' + error.message + '". Refer  to console for further details'
      });
      console.error(error);
    })
}

/**
 * Get value of an element based on its id
 **/
function getValueOf(id) {
  return document.getElementById(id).value;
}
