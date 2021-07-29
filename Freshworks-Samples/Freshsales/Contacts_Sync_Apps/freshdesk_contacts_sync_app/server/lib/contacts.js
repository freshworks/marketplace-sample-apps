"use strict";

const dataStorage = require("./data-storage");

exports = {
  setContactMapping(contactId, freshdeskContactId) {
    return dataStorage.setData(
      contactId,
      "freshdesk_contact_id",
      freshdeskContactId
    );
  },

  getContactMapping(contactId) {
    return dataStorage.getData(contactId, "freshdesk_contact_id");
  },

  deleteContact(contactId) {
    return dataStorage.removeData(contactId);
  },
};
