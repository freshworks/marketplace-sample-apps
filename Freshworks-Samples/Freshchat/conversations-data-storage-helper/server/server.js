const helper = require('./helper');

const PREFIX = 'convo-';

/**
 * To retrieve the note from the data storage.
 *
 * @param {String} conversationId - The conversation_id of the Agent conversation.
 **/
function retrieveNote(conversationId) {
  return $db.get(`${PREFIX}${conversationId}`);
}

exports = {

  /**
  * To get the stored note.
  *
  * @param {String} conversationId - The conversation_id of the Agent conversation.
  **/
  getNote: function (payload) {
    const encodedConversationId = helper.encode(payload.conversation_id);
    retrieveNote(encodedConversationId).then(
      function (data) {
        console.info('Successfully fetched the note data from db');
        console.info(data);
        renderData(null, data);
      },
      function (error) {
        console.error('Failed to store the key-value pair');
        console.error(error);
        renderData(error);
      });
  }
}
