const PREFIX = 'convo-';

/**
 * To store a note to the data storage.
 *
 * @param {String} conversationId - The conversation_id of the Agent conversation.
 * @param {String} note - Note typed by the agent
 **/
function storeNote(conversationId, note) {
    return client.db.set(PREFIX + conversationId, { "note": note });
}

function showNotification(type, message) {
    client.interface.trigger("showNotify", {
        type: type,
        message: message
    });
}

/**
 * To save the note typed by the agent.
 **/
function saveNote() {
    const note = document.getElementById('note').value;
    if (note === "") {
        showNotification('warning', "Note is empty. Type something to save the note.");
        return;
    }
    client.data.get("conversation").then(
        function (conversationData) {
            const encodedConversationId = encode(conversationData.conversation.conversation_id);
            storeNote(encodedConversationId, note).then(
                function () {
                    console.info('Successfully stored the key-value pair');
                    showNotification('success', "Successfully stored the note.");
                    document.getElementById('note').value = '';
                    document.getElementById('noteContainer').style.display = 'none';
                },
                function (error) {
                    console.error('Failed to store the key-value pair');
                    console.error(error);
                    showNotification('danger', "Unable to store the note. Retry again.");
                });
        },
        function (error) {
            console.error('Failed to get conversation details');
            console.error(error);
            showNotification('danger', "Unable to store the note. Retry again.");
        }
    );
}

/**
 * To get the saved note
 **/
function getNote() {
    document.getElementById('noteContainer').style.display = 'none';
    client.data.get("conversation").then(
        function (conversationData) {
            client.request.invoke("getNote", { conversation_id: conversationData.conversation.conversation_id }).then(
                function (noteData) {
                    document.getElementById('noteContainer').style.display = 'block';
                    document.getElementById('savedNote').innerHTML = noteData.response.note;
                },
                function (error) {
                    if (error.status === 404) {
                        console.error('No note is saved yet');
                        showNotification('warning', "No note is saved yet.");
                    } else {
                        console.error('Failed to get conversation details.');
                        console.error(error);
                        showNotification('danger', "Failed to get note. Retry later.");
                    }
                });
        },
        function (error) {
            console.error('Failed to get note');
            console.error(error);
            showNotification('danger', "Failed to get note. Retry later.");
        });
}

document.addEventListener("DOMContentLoaded", function () {
    app.initialized()
        .then(function (_client) {
            window.client = _client;
            client.events.on('app.activated',
                function () {
                    document.getElementById('noteContainer').style.display = 'none';
                    document.getElementById('btnSaveNote').removeEventListener('click', saveNote);
                    document.getElementById('btnSaveNote').addEventListener('click', saveNote);
                    document.getElementById('btnGetNote').removeEventListener('click', getNote);
                    document.getElementById('btnGetNote').addEventListener('click', getNote);
                });
        }).catch(function (error) {
            console.error('Failed to initialise the app.');
            console.error(error);
        });
});
