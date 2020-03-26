const helper = require('./helper');

/**
 * To store a note to the data storage.
 *
 * @param {String} conversationId - The conversation_id of the Agent conversation.
 * @param {String} note - Note typed by the agent
 **/
function storeNote(conversationId, note) {
  const prefix = 'convo-';
  return $db.set(prefix + conversationId, { "note": note })
}

/**
 * To retrieve the note from the data storage.
 *
 * @param {String} conversationId - The conversation_id of the Agent conversation.
 **/
function retrieveNote(conversationId) {
  const prefix = 'convo-';
  return $db.get(prefix + conversationId)
}

exports = {

  /**
  * To get the stored note.
  *
  * @param {String} conversationId - The conversation_id of the Agent conversation.
  **/
  getNote: function (payload) {
    const encodedConversationId = helper.encode(payload.conversation_id)
    retrieveNote(encodedConversationId).then(
      function (data) {
        console.info('got the key-value pair from db successfully')
        console.info(data)
        renderData(null, data);
      },
      function (error) {
        console.error('failed to store the key-value pair successfully')
        console.error(error)
        renderData(error);
      });
  }
}
