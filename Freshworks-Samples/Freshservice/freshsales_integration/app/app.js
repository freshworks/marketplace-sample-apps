var AUTHORIZATION_TEMPLATE = "Token token=<%= iparam.apikey%>";
var CONTACT_INFO_MAPPING = {
  display_name: 'Name',
  email: 'Email',
  mobile_number: 'Mobile'
};
var WORK_INFO_MAPPING = {
  job_title: 'Job Title',
  department: 'Department'
};

function displayErr(message) {
  client.interface.trigger('showNotify', { type: 'danger', message: message });
}

function searchContact(email) {
  return new Promise(function (resolve) {
    client.iparams.get("subdomain").then(function (iparam) {
      var BASE_URL = `https://${iparam.subdomain}.freshsales.io`;
      client.request.get(BASE_URL + '/api/search?q=' + email + '&include=contact', {
        headers: {
          Authorization: AUTHORIZATION_TEMPLATE
        }
      })
        .then(function (data) {
          resolve(JSON.parse(data.response));
        }, function (err) {
          displayErr('Error searching CRM database');
          console.error(err);
        });
    })
  });
}

function fetchContactDetails(contactId) {
  return new Promise(function (resolve) {
    client.iparams.get("subdomain").then(function (iparam) {
      var BASE_URL = `https://${iparam.subdomain}.freshsales.io`;
      client.request.get(BASE_URL + '/api/contacts/' + contactId, {
        headers: {
          Authorization: AUTHORIZATION_TEMPLATE
        }
      })
        .then(function (data) {
          resolve(JSON.parse(data.response));
        }, function (err) {
          displayErr('Error fetching contact from CRM database');
          console.error(err);
        });
    });
  });
}

function getTicketContact() {
  return new Promise(function (resolve) {
    client.data.get('requester')
      .then(function (data) {
        resolve(data);
      }, function (err) {
        displayErr('Error fetching contact from CRM database');
        console.error(err);
      });
  });
}

function displayInfo(title, data) {
  if (data) {
    document.getElementById('contact-info')
      .appendChild('<div class="fw-content-list">\
              <div class="muted">' +
        title +
        '</div>\
              <div>' +
        data +
        '</div>\
            </div>');
  }
}

document.addEventListener('DOMContentLoaded', function (event) {
  async.waterfall([
    function (callback) {
      app.initialized()
        .then(function (_client) {
          window.client = _client;
          callback();
        });
    },

    function (callback) {
      // Get the contact information through data API
      getTicketContact()
        .then(function (contactInformation) {
          callback(null, contactInformation);
        });
    },

    function (contactInformation, callback) {
      // Search CRM
      searchContact(contactInformation.requester.email)
        .then(function (searchResult) {
          callback(null, searchResult);
        });
    },

    function (searchResult, callback) {
      if (searchResult.length > 0) {
        // Pull information from CRM
        fetchContactDetails(searchResult[0].id)
          .then(function (crmContactInformation) {
            callback(null, crmContactInformation);
          });
      }
      else {
        document.getElementById('contact-info').appendChild('<div class="fw-content-list"><div class="muted">Contact not found</div></div>');
      }
    },

    function (crmContactInformation) {
      for (var contactKey in CONTACT_INFO_MAPPING) {
        displayInfo(CONTACT_INFO_MAPPING[contactKey], crmContactInformation.contact[contactKey]);
      }
      document.getElementById('contact-info').appendChild('<div class="fw-divider"></div>');
      for (var contactKey in WORK_INFO_MAPPING) {
        displayInfo(WORK_INFO_MAPPING[contactKey], crmContactInformation.contact[contactKey]);
      }
    }
  ]);
});
