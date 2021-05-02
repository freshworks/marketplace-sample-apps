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
  const contacts = document.querySelectorAll('.contactPhone');
  contacts.forEach(function (contact) {
    contact.removeEventListener('click', function () { });
    contact.addEventListener('click', function () {
      const contactPhone = this.innerText;
      callApi(contactPhone);
    });
  });
}

/**
 * Loads contacts fetched form the contacts API and adds event listeners
 **/
function renderContactList() {
  fetchContacts().then(function (contacts) {
    var contactsList = document.getElementById('contactsList');
    contacts.forEach(function (contact, i) {
      let li = document.createElement('li');
      li.classList.add('list-group-item');
      li.setAttribute('role', 'menuitem');

      let nameDiv = document.createElement('div');
      nameDiv.innerText = contact.name;
      li.appendChild(nameDiv);

      let phoneDiv = document.createElement('div');
      phoneDiv.innerText = contacts[i].phone;
      phoneDiv.classList.add('contactPhone');
      li.appendChild(phoneDiv);

      contactsList.appendChild(li);
    });
    console.log(contactsList)
    contactsEvents();
  });
}
