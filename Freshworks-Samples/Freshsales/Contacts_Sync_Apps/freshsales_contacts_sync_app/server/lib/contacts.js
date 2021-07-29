"use strict";

const dataStorage = require("./data-storage");

exports = {
  setContactMapping: async function (contactId, freshsalesContactId) {
    return dataStorage.setData(
      contactId,
      "freshsales_contact_id",
      freshsalesContactId
    );
  },

  getContactMapping: async function (contactId) {
    return dataStorage.getData(contactId, "freshsales_contact_id");
  },

  deleteContact: async function (contactId) {
    return dataStorage.removeData(contactId);
  },
};
