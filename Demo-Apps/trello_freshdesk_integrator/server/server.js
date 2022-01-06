'use strict';

/**
 * Get Trello Card data from the data storage
 *
 * @param {number} CardId - card id to be searched
 */
function lookupTicketId(cardId) {
  var dbKey = String(`trelloCard:${cardId}`).substring(0, 30);
  return $db.get(dbKey)
}

/**
 * Get Card comment data from the data storage
 *
 * @param {number} ActionId - Action id of the comment to be searched 
 */

function lookupNoteId(actionId) {
  var dbKey = String(`commentCard:${actionId}`).substring(0, 30);
  return $db.get(dbKey)
}

/**
 * Store card comment data in the data storage
 *
 * @param {Object} data - Note data to be stored
 */
function setNoteId(data) {
  var dbKey = String(`commentCard:${data.actionId}`).substring(0, 30);
  $db.set(dbKey, { note_data: data }).then(function () {
    console.info('A note is successfully created for this ticket');
  },
    function (error) {
      console.error("Unable to persist data ,Error: ", error);
      // failure operation
    });
}

/**
 * Store webhook data in the data storage
 *
 * @param {Object} data - webhook data to be stored
 */
function setWebhookId(data) {
  var dbKey = String(`trelloWebhook`).substring(0, 30);
  $db.set(dbKey, { webhook_data: data }).then(function () {
    console.info('Successfully stored the webhook in the db');
    renderData();
  }, error => {
    console.error('Failed to store the webhook the db, Error: ', error);
    renderData({ message: 'The webhook registration failed' });
  });

}


/**
 * delete webhook data in the data storage
 */
function removeWebhookId() {
  var dbKey = String(`trelloWebhook`).substring(0, 30);
  $db.delete(dbKey).then(
    function () {
      // success operation
      // "data" value is { "Deleted" : true }
      console.log("webhook is deleted successfully");
    },
    function (error) {
      console.error('Failed to delete the webhook from db, Error: ', error);
      // failure operation
    });
}

/**
 * delete Card comment data from the data storage
 *
 * @param {number} ActionId - Action id of the comment to be searched 
 */

function removeData(actionID) {
  var dbKey = String(`commentCard:${actionID}`).substring(0, 30);
  $db.delete(dbKey).then(
    function () {
      // success operation
      // "data" value is { "Deleted" : true }
      console.log("note for this ticket is deleted successfully");
    },
    function (error) {
      console.error('Failed to delete the Note from db, Error: ', error);
      // failure operation
    });
}

exports = {
  // args['iparams'] will contain the installation parameter values.
  // args is a JSON block containing the payload information.

  getListSMI: function (args) {
    const iparam = args.iparams;
    let url = `https://api.trello.com/1/boards/${iparam.trelloBoardId}/lists?key=${iparam.trelloApiKey}&token=${iparam.trelloToken}`;
    $request.get(url)
      .then(function (data) {
        try {
          let listData = JSON.parse(data.response);
          renderData(null, listData);
        } catch (error) {
          console.error("Error while attempting to fetch lists", error);
          renderData(error, null);
        }
      },
        function (error) {
          //handle failure
          renderData(error, null);
        }
      );
  },

  getMemberSMI: function (args) {
    const iparam = args.iparams;
    let url = `https://api.trello.com/1/boards/${iparam.trelloBoardId}/members?key=${iparam.trelloApiKey}&token=${iparam.trelloToken}`;
    $request.get(url)
      .then(function (data) {
        try {
          let memberData = JSON.parse(data.response);
          renderData(null, memberData);
        } catch (error) {
          console.error("Error while attempting to fetch members", error);
          renderData(error, null);
        }
      },
        function (error) {
          //handle failure
          renderData(error, null);
        }
      );
  },

  fetchCardSMI: function (args) {
    const iparam = args.iparams;
    let url = `https://api.trello.com/1/cards/${args.cardID}?key=${iparam.trelloApiKey}&token=${iparam.trelloToken}&members=true&list=true&board=true`;;
    $request.get(url)
      .then(function (data) {
        try {
          data = JSON.parse(data.response);
          renderData(null, data);
        } catch (error) {
          console.error("Error while attempting to view Card", error);
          renderData(error, null);
        }
      },
        function (error) {
          //handle failure
          renderData(error, null);
        }
      );
  },

  postCardSMI: function (args) {
    const iparam = args.iparams;
    let url = `https://api.trello.com/1/cards?key=${iparam.trelloApiKey}&token=${iparam.trelloToken}&idList=${args.idList}&idMembers=${args.idMembers}&name=${args.name}&desc=${args.desc}&due=${args.due}`;
    $request.post(url)
      .then(function (data) {
        try {
          data = JSON.parse(data.response);
          renderData(null, data);
        } catch (error) {
          console.error("Error while attempting to create Card", error);
          renderData(error, null);
        }
      },
        function (error) {
          //handle failure
          renderData(error, null);
        }
      );

  },

  postLabelSMI: function (args) {
    const iparam = args.iparams;
    let url = `https://api.trello.com/1/cards/${args.cardId}/labels?key=${iparam.trelloApiKey}&token=${iparam.trelloToken}&name=${args.name}&color=${args.color}`;
    $request.post(url)
      .then(function (data) {
        try {
          renderData(null, data);
        } catch (error) {
          console.error("Error while attempting to create label", error);
          renderData(error, null);
        }
      },
        function (error) {
          //handle failure
          renderData(error, null);
        }
      );
  },

  deleteCardSMI: function (args) {
    const iparam = args.iparams;
    let url = `https://api.trello.com/1/cards/${args.cardID}?key=${iparam.trelloApiKey}&token=${iparam.trelloToken}`;
    $request.delete(url)
      .then(function (data) {
        try {
          renderData(null, data);
        } catch (error) {
          console.error("Error while attempting to create label", error);
          renderData(error, null);
        }
      },
        function (error) {
          //handle failure
          renderData(error, null);
        }
      );

  },

  onInstallHandler: function (args) {
    var iparam = args.iparams;
    generateTargetUrl().then(function (targetUrl) {
      let desc = "fd trello integration webhook";
      $request.post(`https://api.trello.com/1/tokens/${iparam.trelloToken}/webhooks/?description=${desc}&callbackURL=${targetUrl}&idModel=${iparam.trelloBoardId}&key=${iparam.trelloApiKey}`)
        .then(data => {
          let jsonData = JSON.parse(data.response)
          let webhookData = { webhookId: jsonData.id, url: jsonData.callbackURL };
          setWebhookId(webhookData);
        }, error => {
          console.error('Error: Failed to register the webhook for trello', error);
          renderData({ message: 'The webhook registration failed' });
        })
    })
      .fail(function () {
        console.error('Error: Failed to generate the webhook');
        renderData({ message: 'The webhook registration failed' });
      });
  },

  onUnInstallHandler: function (args) {
    var iparam = args.iparams;
    var dbkey = String(`trelloWebhook`).substring(0, 30);
    $db.get(dbkey).then(function (data) {
      $request.delete(`https://api.trello.com/1/tokens/${iparam.trelloToken}/webhooks/${data.webhook_data.webhookId}?key=${iparam.trelloApiKey}`)
        .then(() => {
          console.info('Successfully deregistered the webhook');
          removeWebhookId();
          renderData();
        }, error => renderData({ error: error }));
    }, error => {
      console.error('Error: Failed to get the stored webhook URL from the db', error);
      renderData({ message: 'The webhook deregistration failed' });
    })
  },

  // payload is a JSON block containing the payload information.
  onExternalEventHandler: function (payloadData) {
    var payload = payloadData.data;
    var iparam = payloadData.iparams;
    var link = `https://trello.com/c/${payload.action.data.card.shortLink}`
    if (payload.action.type === 'commentCard') {
      lookupTicketId(payload.action.data.card.id).then(data => {
        $request.post(`${iparam.freshdeskDomain}/api/v2/tickets/${data.card_data.ticketID}/notes`,
          {
            headers: {
              Authorization: `Basic <%= encode(iparam.freshdeskApiKey) %>`
            },
            json: {
              "body": `<p>username: ${payload.action.memberCreator.username}</p><p>comment: ${payload.action.data.text}</p><br><a href=${link} target="_blank" >view in trello</a>`,
              "incoming": true
            }
          }).then((data) => {
            console.info('Successfully added note in the Freshdesk ticket');
            let noteData = { actionId: payload.action.id, noteId: data.response.id }
            setNoteId(noteData);
          }, error => {
            console.error('Failed to add note in  the Freshdesk ticket ,Error:  ', error);
          })
      }, error => {
        console.error('Failed to get card data. Unable to create note , Error:  ', error);
      });
    }
    else if (payload.action.type === 'updateComment') {
      lookupNoteId(payload.action.data.action.id).then(data => {
        $request.put(`${iparam.freshdeskDomain}/api/v2/conversations/${data.note_data.noteId}`,
          {
            headers: {
              Authorization: `Basic <%= encode(iparam.freshdeskApiKey) %>`
            },
            json: {
              "body": `<p>username: ${payload.action.memberCreator.username}</p><p>comment: ${payload.action.data.action.text}</p><br><a href=${link} target="_blank" >view in trello</a>`,
            }
          }).then(() => {
            console.info('Successfully updated note in the Freshdesk ticket');
          }, error => {
            console.error(' Failed to update note in  the Freshdesk ticket, Error: ', error);
          })
      }, error => {
        console.error('Failed to get note data. Unable to update note , Error: ', error);
      });
    }
    else if (payload.action.type === 'deleteComment') {
      lookupNoteId(payload.action.data.action.id).then(data => {
        $request.delete(`${iparam.freshdeskDomain}/api/v2/conversations/${data.note_data.noteId}`,
          {
            headers: {
              Authorization: `Basic <%= encode(iparam.freshdeskApiKey) %>`
            }
          }).then(() => {
            console.info('Successfully deleted note in the Freshdesk ticket');
            removeData(payload.action.data.action.id);
          }, error => {
            console.error('Failed to delete note in  the Freshdesk ticket , Error: ', error);
          })
      }, error => {
        console.error('Failed to get note data. Unable to delete note, Error: ', error);
      });
    }
    else {
      console.info("This action of the trello card is not defined in app's use case");
    }
  }

};
