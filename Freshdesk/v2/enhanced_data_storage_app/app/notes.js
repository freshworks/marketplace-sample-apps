/**
 * This method appends the given note to the last list or if the list is empty, added to a new list
 *
 * @param  {String} note New note to save
 * @return {Promise} Promise that resolves as notes object
 */
function createNote(note) {
  return new Promise((resolve, reject) => {
    client.db.get(`${userId}-notes`).then(data => {
      addNote(data.last_note_index, note).then(resolve, error => {
        console.log('failed to save the note with key index', lastNoteIndex);
        console.log(error);
        reject(error);
      });
    }, error => {
      console.log('failed to get the notes keys with error');
      console.log(error);
      if (error.status === 404) {
        createNewList(`${userId}-notes-1`, note).then(resolve, reject);
      }
    });
  });
}

/**
 * This method adds the given note to an existing list or a new list if the last list has hit the size limit
 *
 * @param  {Number} lastNoteIndex Index of the last node in the list
 * @param  {String} note New note to save
 * @return {Promise} Promise that resolves as notes object
 */
function addNote(lastNoteIndex, note) {
  return new Promise((resolve, reject) => {
    client.db.update(`${userId}-notes-${lastNoteIndex}`, 'append', { notes: [note] }).then(resolve, error => {
      if (error.status === 400 && error.message === 'The combined size of the key and value should not exceed 8KB') {
        createNewList(`${userId} + -notes- + ${(lastNoteIndex + 1)}`, note).then(resolve, reject);
      } else {
        console.log('failed to add note to the list with error');
        console.log(error);
        reject(error);
      }
    });
  });
}

/**
 * This method adds the given note in a new list and adds the list's key to the noteKeys list to track all the lists
 *
 * @param  {Number} noteKey Key of the new list
 * @param  {String} note New note to save
 * @return {Promise} Promise that resolves as notes object
 */
function createNewList(noteKey, note) {
  return new Promise((resolve, reject) => {
    const newValue = { notes: note ? [note] : [] };
    client.db.set(noteKey, newValue).then(() => {
      client.db.update(`${userId}-notes`, 'increment', { 'last_note_index': 1 }).then(() => {
        resolve(newValue);
      }, error => {
        console.log('failed to increament the last node index')
        console.log(error)
        reject(error);
      });
    }, error => {
      console.log('failed to add a note to a new list with error');
      console.log(error);
      reject(error);
    });
  });
}

/**
 * It fetched notes from the list of nodes. If the list is empty or does not exist, a new node gets created.
 *
 * @return {Promise[]} Array of promises that resolve as array of notes objects
 */
function getAllNotes() {
  return client.db.get(`${userId}-notes`).then(data => {
    const notesPromises = [];
    for (let i = 1; i <= data.last_note_index; i++) {
      notesPromises.push(client.db.get(`${userId}-notes-${i}`));
    }
    return Promise.all(notesPromises);
  }, error => {
    if (error.status === 404) {
      return createNewList(`${userId}-notes-1`);
    } else {
      console.log('failed to get keys for the notes with error');
      console.log(error);
    }
  });
}
