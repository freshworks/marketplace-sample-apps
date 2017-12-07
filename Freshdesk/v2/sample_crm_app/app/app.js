var BASE_URL = 'https://<%= iparam.subdomain %>.freshsales.io';
var AUTHORIZATION_TEMPLATE = "Basic <%= encode(iparam.username + ':' + iparam.password)%>";
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
  client.interface.trigger('showNotify', { type: 'danger', message: message});
}

function searchContact(email) {
  return new Promise(function(resolve) {
    client.request.get(BASE_URL + '/api/search?q=' + email + '&include=contact', {
      headers: {
        Authorization: AUTHORIZATION_TEMPLATE
      }
    })
    .then(function(data) {
      resolve(JSON.parse(data.response));
    }, function() {
      displayErr('Error searching CRM database');
    });
  });
}

function fetchContactDetails(contactId) {
  return new Promise(function(resolve) {
    client.request.get(BASE_URL + '/api/contacts/' + contactId, {
      headers: {
        Authorization: AUTHORIZATION_TEMPLATE
      }
    })
    .then(function(data) {
      resolve(JSON.parse(data.response));
    }, function() {
      displayErr('Error fetching contact from CRM database');
    });
  });
}

function getTicketContact() {
  return new Promise(function(resolve) {
    client.data.get('contact')
    .then(function(data) {
      resolve(data);
    }, function() {
      displayErr('Error fetching contact from CRM database');
    });
  });
}

function displayInfo(title, data) {
  if (data) {
    jQuery('#contact-info')
    .append('<div class="fw-content-list">\
              <div class="muted">' +
                title +
              '</div>\
              <div>' +
                data +
              '</div>\
            </div>');
  }
}

$(document).ready( function() {
  async.waterfall([
    function(callback) {
      app.initialized()
      .then(function(_client) {
        window.client = _client;
        callback();
      });
    },

    function(callback) {
      // Get the contact information through data API
      getTicketContact()
      .then(function(contactInformation) {
        callback(null, contactInformation);
      });
    },

    function(contactInformation, callback) {
      // Search CRM
      searchContact(contactInformation.contact.email)
      .then(function(searchResult) {
        callback(null, searchResult);
      });
    },

    function(searchResult, callback) {
      if (searchResult.length > 0) {
        // Pull information from CRM
        fetchContactDetails(searchResult[0].id)
        .then(function(crmContactInformation) {
          callback(null, crmContactInformation);
        });
      }
      else {
        jQuery('#contact-info').append('<div class="fw-content-list"><div class="muted">Contact not found</div></div>');
      }
    },

    function(crmContactInformation) {
      for (var contactKey in CONTACT_INFO_MAPPING) {
        displayInfo(CONTACT_INFO_MAPPING[contactKey], crmContactInformation.contact[contactKey]);
      }
      jQuery('#contact-info').append('<div class="fw-divider"></div>');
      for (var contactKey in WORK_INFO_MAPPING) {
        displayInfo(WORK_INFO_MAPPING[contactKey], crmContactInformation.contact[contactKey]);
      }
    }
  ]);
});
