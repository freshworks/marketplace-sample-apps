/**
 * @description - Everytime the ticket details page is loaded, this app makes an
 * API call to the Freshsales CRM to retrieve additional information about
 * the ticket requester.
 * 
 * 1. Using data API to get ticket requester's details
 * 2. Request API - GET request to retrieve the ticket requester's details.
 */

const BASE_URL = 'https://<%= iparam.subdomain %>.freshsales.io';
const AUTHORIZATION_TEMPLATE = "Basic <%= encode(iparam.username + ':' + iparam.password)%>";
const CONTACT_INFO_MAPPING = {
  display_name: 'Name',
  email: 'Email',
  mobile_number: 'Mobile'
};
const WORK_INFO_MAPPING = {
  job_title: 'Job Title',
  department: 'Department'
};

/**@fires - Interface API to show Notification */
function displayErr(message) {
  client.interface.trigger('showNotify', { type: 'danger', message: message});
}

/**@fires - A promise
 * To search for an Contact in the JSON endpoint
 * @param - Stirng, email
 */
function searchContact(email) {
  return new Promise((resolve) => {
    client.request.get(BASE_URL + '/api/search?q=' + email + '&include=contact', {
      headers: {
        Authorization: AUTHORIZATION_TEMPLATE
      }
    }).then((data) => {
      resolve(JSON.parse(data.response));
    }, 
    () => {
      displayErr('Error searching CRM database');
    });
  });
}

/**@fires - A Reqeust API using a Promise, which fetches contact details from
 * the contactId  
 */
function fetchContactDetails(contactId) {
  return new Promise((resolve) => {
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
    client.data.get('contact').then((data) => {
      resolve(data);
    }, () => {
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

$(document).ready( () => {
  async.waterfall([(callback) => {
      app.initialized().then((_client) => {
        window.client = _client;
        callback();
      });
    },

    (callback) => {
      // Get the contact information through data API
      getTicketContact().then((contactInformation) => {
        callback(null, contactInformation);
      });
    },

    (contactInformation, callback) => {
      // Search CRM
      searchContact(contactInformation.contact.email)
      .then((searchResult) => {
        callback(null, searchResult);
      });
    },

    (searchResult, callback) => {
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

    (crmContactInformation) => {
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
