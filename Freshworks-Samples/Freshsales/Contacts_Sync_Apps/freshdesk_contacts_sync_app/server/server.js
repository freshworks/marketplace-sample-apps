'use strict';

const utils = require('./lib/utils');
const contacts = require('./lib/contacts');

/**
 * @desc -
 *
 * This app makes an API request to update the contact details in Freshdesk whenever a contact is modified
 * in the Freshsales.
 *
 * The Freshdesk account is authenticated through the API key sent in the header of every API request.
 * The events on ticket modification is raised from product events feature of the FDK platform.
 * Product events with corresponding callback functions to perform an action is registered as follows.
 **/
const baseUrl = 'https://ravirajsubramanian.freshdesk.com';
const searchContactUrl = baseUrl + '/api/v2/search/contacts';
const contactUrl = baseUrl + '/api/v2/contacts/';

const headers = { 'Authorization': 'Basic <%= encode(iparam.freshdesk_api_key)%>' };

function buildOptions(url, method, headers, body) {
  return Object.assign({
    url: url,
    method: method,
    headers: headers
  }, body ? { body } : null);
}

function getRequestOptions(email) {
  return buildOptions(searchContactUrl + '?query="email:\'' + email + '\'"', 'GET', headers, null);
}
function putRequestOptions(freshdeskContactId, changes) {
  return buildOptions(contactUrl + freshdeskContactId, 'PUT', headers, changes);
}
function deleteRequestOptions(freshdeskContactId) {
  return buildOptions(contactUrl + freshdeskContactId, 'DELETE', headers);
}
function postRequestOptions(body) {
  return buildOptions(contactUrl, 'POST', headers, body);
}

/**
 * The given contact is searched with Freshdesk API and the contact ID is stored in the data-storage for caching the mapping.
 */
async function fetchContactIdFromFreshdesk(freshsalesContact) {
  try {
    const data = await utils.makeGetRequest(getRequestOptions(freshsalesContact.email));

    if (typeof data.response === 'string') {
      data.response = JSON.parse(data.response);
    }
    if (!data.response.results.length) {
      throw new Error('contact not found');
    }
    try {
      await contacts.setContactMapping(freshsalesContact.id, data.response.results[0].id);
      return data.response.results[0].id;
    } catch (error) {
      console.log('failed to store the contact mapping of contact id:', freshsalesContact.id, ' with freshdesk contact id:', data.response.results[0].id);
      console.log(error);
      throw error;
    }
  } catch (error) {
    console.log('got error in making get request to freshdesk to fetch contact info');
    console.log(error);
    throw error;
  }
}

/**
 * The contact ID varies from Freshsales and Freshdesk. So, the mapping of these two are stored with
 * taking advantage of the data-storage feature of the FDK platform.
 *
 * In the following method, the contact ID is checked from the data-storage and returned if it exists.
 * It not, the contact is searched with Freshdesk API and the contact ID is stored in the data-storage for further usage.
 */
async function getFreshdeskContactId(payload) {
  try {
    const data = await contacts.getContactMapping(payload.data.contact.id);

    return data ? data : await fetchContactIdFromFreshdesk(payload.data.contact);
  } catch (error) {
    console.log('unable to get existing contact');
    console.log(error);
    return fetchContactIdFromFreshdesk(payload.data.contact);
  }
}

/**
 * In the following helper method, the full_name will be splitted into the first_name and the last_name
 */
function addName(firstName, newFirstName, lastName, newLastName) {
  if (!newFirstName && !newLastName) {
    return null;
  }
  return { name: ((newFirstName[1] || firstName) + ' ' + (newLastName[1] || lastName)) };
}

const contactAttributes = {
  email: 'email',
  address: 'address',
  avatar: 'avatar',
  job_title: 'job_title',
  time_zone: 'time_zone',
  mobile_number: 'mobile',
  work_number: 'phone',
  deleted: 'deleted'
};

/**
 * In the following method, the changed attributes are modified with respect to the Freshdesk contact attributes
 */
function fetchUpdates(contact) {
  const changes = contact.changes;
  const newContact = {};

  Object.keys(changes).forEach(attribute => {
    if (contactAttributes[attribute]) {
      newContact[contactAttributes[attribute]] = changes[attribute][1];
    }
  });
  return Object.assign({}, newContact,
    { twitter_id: changes.twitter[1].split('https://twitter.com/')[1] },
    addName(contact.first_name, changes.first_name, contact.last_name, changes.last_name)
  );
}

/**
 * In the following method, the contact attributes from freshdesk are modified with respect to the Freshsales contact attributes
 */
function fetchContactAttributes(contact) {
  return Object.assign({}, {
    email: contact.email,
    address: contact.address,
    avatar: contact.avatar,
    job_title: contact.job_title,
    time_zone: contact.time_zone,
    mobile: contact.mobile_number,
    phone: contact.work_number,
    name: contact.first_name + ' ' + contact.last_name
  },
    { twitter_id: contact.twitter.split('https://twitter.com/')[1] });
}

exports = {
  events: [
    { event: 'onContactCreate', callback: 'onContactCreateHandler' },
    { event: 'onContactUpdate', callback: 'onContactUpdateHandler' },
    { event: 'onContactDelete', callback: 'onContactDeleteHandler' }
  ],

  /**
   * In the following event listerner method, contact attributes and it's changes are captured from the payload
   * passed as the argument to the method.
   *
   * The same changes are made in the Freshsales account through a PUT API request.
   **/
  onContactUpdateHandler: async function (payload) {
    try {
      const freshdeskContactId = await getFreshdeskContactId(payload);

      const changes = fetchUpdates(payload.data.contact);

      if (!utils.isEmpty(changes)) {
        try {
          await utils.makePutRequest(putRequestOptions(freshdeskContactId, changes));
          console.log('successfully updated freshdesk contact details');
        } catch (error) {
          console.log('failed to update freshdesk contact details');
          throw error;
        }
      } else {
        console.log('no changes in sync attributes');
      }
    } catch (error) {
      console.log('failed to fetch the freshdesk contact');
      console.log(error);
    }
  },

  /**
  * In the following event listerner method, contact attributes are captured from the payload
  * passed as the argument to the method.
  *
  * The same contact will be create in the Freshdesk account through a POST API request.
  */
  onContactCreateHandler: async function (payload) {
    try {
      const freshdeskContactId = await getFreshdeskContactId(payload);

      console.log('Contact already exists with email:', payload.data.contact.email, ' with id:', freshdeskContactId);
    } catch (error) {
      console.log('Contact does not exist already. Creating a new contact.');
      const contactAttributes = fetchContactAttributes(payload.data.contact);

      try {
        await utils.makePostRequest(postRequestOptions(contactAttributes));
        console.log('successfully created freshdesk contact');
      } catch (error) {
        console.log('failed to create a freshdesk contact');
        console.log(error);
      }
    }
  },

  /**
  * In the following event listerner method, contact attributes are captured from the payload
  * passed as the argument to the method.
  *
  * The same contact will be deleted from the Freshdesk account through a DELETE API request.
  */
  onContactDeleteHandler: async function (payload) {
    try {
      const freshdeskContactId = await getFreshdeskContactId(payload);

      try {
        await utils.makeDeleteRequest(deleteRequestOptions(freshdeskContactId));
        try {
          await contacts.deleteContact(payload.data.contact.id);
          console.log('successfully deleted freshdesk contact');
        } catch (error) {
          console.log('unable to remove the contact mapping after deletion of contact with error');
          console.log(error);
        }
      } catch (error) {
        console.log('failed to delete freshdesk contact');
        console.log(error);
      }
    } catch (error) {
      console.log('failed to fetch the freshdesk contact');
      console.log(error);
    }
  }
};
