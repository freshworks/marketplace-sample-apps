"use strict";

/**
 * Sets the status of the ticket in Data Storage
 * @param {string} ticketId - ID of the ticket
 * @param {boolean} status  - Status of the request
 */
function setStatus(ticketId, status) {
  $db.set(`${ticketId}_status`, {
    status,
  });
}

exports = {
  setStatus,
};
