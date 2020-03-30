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
    const note = $('#note').val();
    if (note === "") {
        showNotification('warning', "Note is empty. Type something to save the note.");
        return;
    }
    client.data.get("conversation").then(
        function (conversationData) {
            const encodedConversationId = encode(conversationData.conversation.conversation_id);
            storeNote(encodedConversationId, note).then(
                function () {
                    console.info('stored the key-value pair successfully');
                    showNotification('success', "Successfully stored the note.");
                    $('#note').val("");
                    $('#noteContainer').hide();
                },
                function (error) {
                    console.error('failed to store the key-value pair successfully');
                    console.error(error);
                    showNotification('danger', "Unable to store the note. Retry again.");
                });;
        },
        function (error) {
            console.error('Failed to get conversation details.');
            console.error(error);
            showNotification('danger', "Unable to store the note. Retry later.");
        }
    );
}

/**
 * To get the saved note
 **/
function getNote() {
    $('#noteContainer').hide();
    client.data.get("conversation").then(
        function (conversationData) {
            client.request.invoke("getNote", { conversation_id: conversationData.conversation.conversation_id }).then(
                function (noteData) {
                    $('#noteContainer').show();
                    $('#savedNote').html(noteData.response.note);
                },
                function (error) {
                    if (error.status === 404) {
                        console.error('No note is saved yet.');
                        showNotification('warning', "No note is saved yet.");
                    } else {
                        console.error('Failed to get conversation details.');
                        console.error(error);
                        showNotification('danger', "Failed to get note. Retry later.");
                    }
                });
        },
        function (error) {
            console.error('failed to get note');
            console.error(error);
            showNotification('danger', "Failed to get note. Retry later.");
        });
}

$(document).ready(function () {
    app.initialized()
        .then(function (_client) {
            window.client = _client;
            client.events.on('app.activated',
                function () {
                    $('#noteContainer').hide();
                    $("#btnSaveNote").off();
                    $("#btnSaveNote").on('click', saveNote);

                    $("#btnGetNote").off();
                    $("#btnGetNote").on('click', getNote);
                });
        }).catch(function (error) {
            console.error('Failed to initialise the app.');
            console.error(error);
        });
});
