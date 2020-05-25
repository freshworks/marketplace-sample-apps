'use strict';

/**
 * Store Github issue data in the data storage
 *
 * @param {Object} data - Issue data to be stored
 */
//👇 Paste code for saveMapping() here 👇 - 🚩


/**
 * Get Github issue data with issue number from the data storage
 *
 * @param {number} issueNumber - GitHub issue number to be searched
 */
function lookupTicketId(issueNumber) {
  var dbKey = String(`gitIssue:${issueNumber}`).substr(0, 30);
  return $db.get(dbKey)
}

exports = {

  events: [

  ],

  // Ticket create handler

  // App Install Handler goes here 


  // App Uninstall handler goes here 



  // External Event handler goes here

};

