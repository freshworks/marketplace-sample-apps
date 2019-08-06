'use strict';

const utils = require('./lib/utils');
const contacts = require('./lib/contacts');

/**
 * @desc -
 *
 * This app makes an API request to update the contact details in Freshsales whenever a contact is modified
 * in the Freshdesk.
 *
 * The Freshsales account is authenticated through the API key sent in the header of every API request.
 * The events on ticket modification is raised from product events feature of the FDK platform.
 * Product events with corresponding callback functions to perform an action is registered as follows.
 */

const baseUrl = 'https://<%= iparam.freshsales_subdomain %>.freshsales.io';
const searchContactUrl = baseUrl + '/api/search?include=contact&per_page=2&q=';
const contactUrl = baseUrl + '/api/contacts';

const headers = {
  'Authorization': 'Token token=<%= iparam.freshsales_api_key %>',
  'Content-Type': 'application/json'
};

function buildOptions(url, method, headers, body) {
  return Object.assign({
    url: url,
    method: method,
    headers: headers
  }, body ? { body } : null);
}

function getRequestOptions(email) {
  return buildOptions(searchContactUrl + email, 'GET', headers, null);
}
function putRequestOptions(freshsalesContactId, changes) {
  return buildOptions(contactUrl + '/' + freshsalesContactId, 'PUT', headers, changes);
}
function deleteRequestOptions(freshsalesContactId) {
  return buildOptions(contactUrl + '/' + freshsalesContactId, 'DELETE', headers);
}
function postRequestOptions(body) {
  return buildOptions(contactUrl, 'POST', headers, body);
}

/**
 * The given contact is searched with Freshsales API and the contact ID is stored in the data-storage for caching the mapping.
 */
async function fetchContactIdFromFreshsales(freshdeskContact) {
  try {
    const data = await utils.makeGetRequest(getRequestOptions(freshdeskContact.email));

    if (typeof data.response === 'string') {
      data.response = JSON.parse(data.response);
    }
    if (!data.response.length) {
      throw new Error('contact not found');
    }
    await contacts.setContactMapping(freshdeskContact.id, data.response[0].id);
    return data.response[0].id;
  } catch (error) {
    console.log('failed to fetch contact id from freshsales');
    throw error;
  }
}

/**
 * The contact ID varies from Freshdesk and Freshsales. So, the mapping of these two are stored with taking advantage of the data-storage feature
 * of the FDK platform.
 *
 * In the following method, the contact ID is checked from the data-storage and returned if it exists.
 * It not, the contact is searched with Freshsales API and the contact ID is stored in the data-storage for further usage.
 */
async function getFreshsalesContactId(payload) {
  try {
    const data = await contacts.getContactMapping(payload.data.contact.id);

    return data ? data : await fetchContactIdFromFreshsales(payload.data.contact);
  } catch (error) {
    console.log('unable to get existing contact');
    console.log(error);
    return fetchContactIdFromFreshsales(payload.data.contact);
  }
}

const contactAttributes = {
  email: 'email',
  address: 'address',
  avatar: 'avatar',
  job_title: 'job_title',
  time_zone: 'time_zone',
  mobile: 'mobile_number',
  phone: 'work_number',
  deleted: 'deleted'
};

/**
 * In the following helper method, the full_name will be splitted into the first_name and the last_name
 */
function splitName(fullname) {
  if (!fullname) {
    return {};
  }
  const names = fullname.split(' ');

  return {
    first_name: names.shift(),
    last_name: names.join(' ')
  };
}

/**
 * In the following method, the changed attributes are modified with respect to the Freshsales contact attributes
 */
function fetchUpdates(contact) {
  const newContact = {};

  Object.keys(contact).forEach(attribute => {
    if (contactAttributes[attribute]) {
      newContact[contactAttributes[attribute]] = contact[attribute][1];
    }
  });
  return Object.assign({}, newContact,
    { twitter: 'https://twitter.com/' + contact.twitter_id[1] },
    splitName(contact.name[1]));
}

/**
 * In the following method, the contact attributes from freshdesk are modified with respect to the Freshsales contact attributes
 */
function fetchContactAttributes(contact) {
  const name = splitName(contact.name);

  return {
    email: contact.email,
    address: contact.address,
    avatar: contact.avatar,
    job_title: contact.job_title,
    time_zone: contact.time_zone,
    mobile_number: contact.mobile,
    work_number: contact.phone,
    first_name: name.first_name,
    last_name: name.last_name,
    twitter: 'https://twitter.com/' + contact.twitter_id
  };
}

async function deleteContact(freshsalesContactId, contactId) {
  try {
    await utils.makeDeleteRequest(deleteRequestOptions(freshsalesContactId));
    await contacts.deleteContact(contactId);
    console.log('successfully deleted the contact');
  } catch (error) {
    console.log('failed to delete freshsales contact with error');
    console.log(error);
  }
}

async function updateContact(freshsalesContactId, contactChanges) {
  try {
    console.log('updating contact details with id:', freshsalesContactId, ' with changes:', contactChanges);
    await utils.makePutRequest(putRequestOptions(freshsalesContactId, contactChanges));
    console.log('successfully updated freshsales contact details');
  } catch (error) {
    console.log('failed to update freshsales contact details');
    console.log(error);
  }
}

exports = {
  events: [
    { event: 'onContactCreate', callback: 'onContactCreateHandler' },
    { event: 'onContactUpdate', callback: 'onContactUpdateHandler' }
  ],

  /**
   * In the following event listerner method, contact attributes and it's changes are captured from the payload
   * passed as the argument to the method.
   *
   * The same changes are made in the Freshsales account through a PUT API request.
   */
  onContactUpdateHandler: async function (payload) {
    try {
      const freshsalesContactId = await getFreshsalesContactId(payload);
      const changes = fetchUpdates(payload.data.contact.changes);

      if (!utils.isEmpty(changes)) {
        if (changes.deleted) {
          await deleteContact(freshsalesContactId, payload.data.contact.id);
        } else {
          await updateContact(freshsalesContactId, changes);
        }
      } else {
        console.log('no changes in sync attributes');
      }
    } catch (error) {
      console.log('failed to fetch freshsales contact id');
      console.log(error);
    }
  },

  /**
   * In the following event listerner method, contact attributes are captured from the payload
   * passed as the argument to the method.
   *
   * The same contact will be create in the Freshsales account through a POST API request.
   */
  onContactCreateHandler: async function (payload) {
    try {
      const freshsalesContactId = await getFreshsalesContactId(payload);

      console.log('Contact already exists with email:', payload.data.contact.email, ' with id:', freshsalesContactId);
    } catch (error) {
      console.log('Contact does not exist already. Creating a new contact.');
      const contactAttributes = fetchContactAttributes(payload.data.contact);

      try {
        await utils.makePostRequest(postRequestOptions({ contact: contactAttributes }));
        console.log('successfully created freshsales contact');
      } catch (error) {
        console.log('failed to create freshsales contact with error');
        console.log(error);
      }
    }
  }
};
