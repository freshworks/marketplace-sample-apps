'use strict';

const dataStorage = require('./data-storage');

exports = {
  setContactMapping(contactId, freshdeskContactId) {
    dataStorage.setData(contactId, 'freshdesk_contact_id', freshdeskContactId);
  },

  getContactMapping(contactId) {
    dataStorage.getData(contactId, 'freshdesk_contact_id');
  },

  deleteContact(contactId) {
    dataStorage.removeData(contactId);
  }
};
