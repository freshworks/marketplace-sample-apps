'use strict';

/**
 * Get Trello Card data from the data storage
 *
 * @param {number} CardId - card id to be searched
 */
async function lookupTicketId(cardId) {
  let dbKey = String(`trelloCard:${cardId}`).substring(0, 30);
  return await $db.get(dbKey);
}

/**
 * Get Card comment data from the data storage
 *
 * @param {number} ActionId - Action id of the comment to be searched 
 */

async function lookupNoteId(actionId) {
  let dbKey = String(`commentCard:${actionId}`).substring(0, 30);
  return await $db.get(dbKey);
}

/**
 * Store card comment data in the data storage
 *
 * @param {Object} data - Note data to be stored
 */
async function setNoteId(data) {
  try {
    let dbKey = String(`commentCard:${data.actionId}`).substring(0, 30);
    await $db.set(dbKey, { note_data: data });
    console.info('A note is successfully created for this ticket');
  }
  catch (error) {
    console.error("Unable to persist data ");
    console.error(error);
  };
}

/**
 * Store webhook data in the data storage
 *
 * @param {Object} data - webhook data to be stored
 */
async function setWebhookId(data) {
  try {
    let dbKey = String(`trelloWebhook`).substring(0, 30);
    await $db.set(dbKey, { webhook_data: data });
    console.info('Successfully stored the webhook in the db');
    renderData();
  }
  catch (error) {
    console.error('Error: Failed to store the webhook the db');
    console.error(error);
    renderData({ message: 'The webhook registration failed' });
  };
}


/**
 * delete webhook data in the data storage
 */
async function removeWebhookId() {
  try {
    let dbKey = String(`trelloWebhook`).substring(0, 30);
    await $db.delete(dbKey);
    console.info("webhook is deleted successfully");
  }
  catch (error) {
    console.error('Failed to delete the webhook from db');
    console.error(error);
  };
}

/**
 * delete Card comment data from the data storage
 *
 * @param {number} ActionId - Action id of the comment to be searched 
 */

async function removeData(actionID) {
  let dbKey = String(`commentCard:${actionID}`).substring(0, 30);
  await $db.delete(dbKey);
  console.info("note for this ticket is deleted successfully");

}

exports = {
  // args['iparams'] will contain the installation parameter values.
  // args is a JSON block containing the payload information.

  getListSMI: async function (args) {
    try {
      const iparam = args.iparams;
      let url = `https://api.trello.com/1/boards/${iparam.trelloBoardId}/lists?key=${iparam.trelloApiKey}&token=${iparam.trelloToken}`;
      let data = await $request.get(url);
      let listData = JSON.parse(data.response);
      renderData(null, listData);
    }
    catch (error) {
      console.error("Error while attempting to fetch lists");
      console.error(error);
      renderData(error, null);
    }
  },

  getMemberSMI: async function (args) {
    try {
      const iparam = args.iparams;
      let url = `https://api.trello.com/1/boards/${iparam.trelloBoardId}/members?key=${iparam.trelloApiKey}&token=${iparam.trelloToken}`;
      let data = await $request.get(url);
      let memberData = JSON.parse(data.response);
      renderData(null, memberData);
    }
    catch (error) {
      console.error("Error while attempting to fetch members");
      console.error(error);
      renderData(error, null);
    }
  },

  fetchCardSMI: async function (args) {
    try {
      const iparam = args.iparams;
      let url = `https://api.trello.com/1/cards/${args.cardID}?key=${iparam.trelloApiKey}&token=${iparam.trelloToken}&members=true&list=true&board=true`;;
      let data = await $request.get(url);
      data = JSON.parse(data.response);
      renderData(null, data);
    }
    catch (error) {
      console.error("Error while attempting to view Card");
      console.error(error);
      renderData(error, null);
    }
  },

  postCardSMI: async function (args) {
    try {
      const iparam = args.iparams;
      let url = `https://api.trello.com/1/cards?key=${iparam.trelloApiKey}&token=${iparam.trelloToken}&idList=${args.idList}&idMembers=${args.idMembers}&name=${args.name}&desc=${args.desc}&due=${args.due}`;
      let data = await $request.post(url);
      data = JSON.parse(data.response);
      renderData(null, data);
    }
    catch (error) {
      console.error("Error while attempting to create Card");
      console.error(error);
      renderData(error, null);
    }
  },

  postLabelSMI: async function (args) {
    try {
      const iparam = args.iparams;
      let url = `https://api.trello.com/1/cards/${args.cardId}/labels?key=${iparam.trelloApiKey}&token=${iparam.trelloToken}&name=${args.name}&color=${args.color}`;
      let data = await $request.post(url);
      renderData(null, data);
    }
    catch (error) {
      console.error("Error while attempting to create label");
      console.error(error);
      renderData(error, null);
    }
  },

  deleteCardSMI: async function (args) {
    try {
      const iparam = args.iparams;
      let url = `https://api.trello.com/1/cards/${args.cardID}?key=${iparam.trelloApiKey}&token=${iparam.trelloToken}`;
      let data = await $request.delete(url);
      renderData(null, data);
    }
    catch (error) {
      console.error("Error while attempting to delete card");
      console.error(error);
      renderData(error, null);
    }

  },

  onInstallHandler: function (args) {
    const iparam = args.iparams;
    generateTargetUrl().then(function (targetUrl) {
      let desc = "fd trello integration webhook";
      $request.post(`https://api.trello.com/1/tokens/${iparam.trelloToken}/webhooks/?description=${desc}&callbackURL=${targetUrl}&idModel=${iparam.trelloBoardId}&key=${iparam.trelloApiKey}`)
        .then(data => {
          let jsonData = JSON.parse(data.response)
          let webhookData = { webhookId: jsonData.id, url: jsonData.callbackURL };
          setWebhookId(webhookData);
        }, error => {
          console.error('Error: Failed to register the webhook for trello');
          console.error(error);
          renderData({ message: 'The webhook registration failed' });
        })
    })
      .catch(function () {
        console.error('Error: Failed to generate the webhook');
        renderData({ message: 'The webhook registration failed' });
      });
  },

  onUnInstallHandler: function (args) {
    const iparam = args.iparams;
    let dbkey = String(`trelloWebhook`).substring(0, 30);
    $db.get(dbkey).then(function (data) {
      $request.delete(`https://api.trello.com/1/tokens/${iparam.trelloToken}/webhooks/${data.webhook_data.webhookId}?key=${iparam.trelloApiKey}`)
        .then(() => {
          console.info('Successfully deregistered the webhook');
          removeWebhookId();
          renderData();
        }, error => renderData({ error: error }));
    }, error => {
      console.error('Error: Failed to get the stored webhook URL from the db');
      console.error(error)
      renderData({ message: 'The webhook deregistration failed' });
    })
  },

  // payload is a JSON block containing the payload information.
  onExternalEventHandler: function (payloadData) {
    let payload = payloadData.data;
    const iparam = payloadData.iparams;
    let link = `https://trello.com/c/${payload.action.data.card.shortLink}`
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
            console.error('Error: Failed to add note in  the Freshdesk ticket');
            console.error(error)
          })
      }, error => {
        console.error('Error: Failed to get card data. Unable to create note');
        console.error(error);
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
            console.error('Error: Failed to update note in  the Freshdesk ticket');
            console.error(error)
          })
      }, error => {
        console.error('Error: Failed to get note data. Unable to update note');
        console.error(error);
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
            console.error('Error: Failed to delete note in  the Freshdesk ticket');
            console.error(error)
          })
      }, error => {
        console.error('Error: Failed to get note data. Unable to delete note');
        console.error(error);
      });
    }
    else {
      console.info("This action of the trello card is not defined in app's use case");
    }
  }
};
