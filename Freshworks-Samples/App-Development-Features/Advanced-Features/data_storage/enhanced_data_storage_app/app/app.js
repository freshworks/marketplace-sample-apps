/**
 * This method fetches all the notes and renders in the notes container element.
 */

function displayNotes() {
  getAllNotes().then(
    (data) => {
      q("#note").value = "";
      const noteList = [];
      if (Array.isArray(data) && data.length && data[0].notes.length) {
        data.forEach((node) => {
          node.notes.forEach((note) => {
            noteList.push(note);
          });
        });
        q("#notesList").innerHTML = `<p>${noteList.join("</p><p>")}</p>`;
      } else {
        q("#notesList").innerHTML = "<p>No notes yet!</p>";
      }
    },
    (error) => {
      console.log("failed to get all the notes with error");
      console.log(error);
      notify("danger", "Failed to load the notes");
    }
  );
}

/**
 * This method saves the note from the note input field
 */
function saveNote() {
  const noteData = q("#note").value;
  if (noteData === "") {
    notify("warning", "Note is empty");
    return;
  }
  createNote(noteData).then(
    () => {
      notify("success", "Note has been stored");
      displayNotes();
    },
    () => {
      notify("danger", "Error storing the note");
    }
  );
}

/**
 * This method notifies the passed message with the given type with the notification interface API
 *
 * @param  {String} status type of the notification
 * @param  {String} message input notification message
 */
function notify(status, message) {
  client.interface.trigger("showNotify", {
    type: status,
    message: message,
  });
}

/**
 * App gets initilised and notes rendered when the page is loaded
 */
document.addEventListener("DOMContentLoaded", () => {
  app.initialized().then(
    (_client) => {
      window.client = _client;
      client.events.on("app.activated", () => {
        client.data.get("loggedInUser").then(
          (userData) => {
            window.userId = userData.loggedInUser.id;
            displayNotes();
            q("#saveNote").addEventListener("click", saveNote);
          },
          (error) => {
            console.log("failed to get user data with error");
            console.log(error);
          }
        );
      });
    },
    (error) => {
      console.log("failed to initialise the app with error");
      console.log(error);
    }
  );
});

function q(selector) {
  return document.querySelector(selector);
}
