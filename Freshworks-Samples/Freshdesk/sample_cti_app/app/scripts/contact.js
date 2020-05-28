/**
 * Makes an API to Freshdesk to fetch all the contacts
 **/
function fetchContacts() {
  return new Promise(function (resolve, reject) {
    client.data.get("domainName").then(
      function (domainData) {
        const url = 'https://'.concat(domainData.domainName, '/api/v2/contacts');
        const options = {
          headers: {
            Authorization: 'Basic <%= encode(iparam.freshdesk_api_key) %>'
          }
        }
        client.request.get(url, options).then(function (data) {
          return resolve(JSON.parse(data.response));
        }, function (error) {
          console.error(error);
          return reject(error);
        });
      }, function (error) {
        console.error(error);
        return reject(error);
      });
  });
}

/**
 * Event listeners on contacts page
 **/
function contactsEvents() {
  $('.contactPhone').off("click")
  $('.contactPhone').on("click", function () {
    const contactPhone = $(this).text();
    callApi(contactPhone);
  });
}

/**
 * Loads contacts fetched form the contacts API and adds event listeners
 **/
function renderContactList() {
  fetchContacts().then(function (contacts) {
    var contactNames = contacts.map(function (contact) {
      return contact.name;
    });
    var contactPhones = contacts.map(function (contact) {
      return contact.phone;
    });
    var contactsList = $('#contactsList')
    $.each(contactNames, function (i) {
      var li = $('<li/>')
        .addClass('list-group-item')
        .attr('role', 'menuitem')
        .appendTo(contactsList);
      $('<div/>')
        .text(contactNames[i])
        .appendTo(li);
      $('<div/>')
        .text(contactPhones[i])
        .addClass('contactPhone')
        .appendTo(li);
    });
    contactsEvents();
  }, function (error) {
    console.error('Error: Failed to fetch the contacts list');
    console.error(error);
    showNotify('danger', 'Failed to load the contacts. Try again later.');
  })
}
