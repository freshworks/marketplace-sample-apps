"use strict";

/**
 * In the following updateData method, the given attributes are updated with given action
 * as an object with a key in the format of "contact:1" where 1 is the given contact ID.
 **/
async function updateData(contactId, attributes, action) {
  return $db.update("contact:" + contactId, action, attributes);
}

/**
 * In the following setData method, the given key and value are stored as an object with
 * a key in the format of "contact:1" where 1 is the given contact ID.
 *
 * It calls updateData method inside to store the attributed using set option.
 **/
async function setData(contactId, key, value) {
  const attributes = {};

  attributes[key] = value;
  return updateData(contactId, attributes, "set");
}

/**
 * In the following getData method, the data stored with given contact ID is fetched and
 * returned the value in the attribute with the given key.
 **/
async function getData(contactId, key) {
  try {
    const data = await $db.get("contact:" + contactId);
    return data[key];
  } catch (error) {
    console.log("failed to get stored contact information");
    console.log(error);
    throw error;
  }
}

async function removeData(contactId) {
  return $db.delete("contact:" + contactId);
}

exports = {
  setData,
  updateData,
  getData,
  removeData,
};
