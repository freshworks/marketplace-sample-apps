/**
 * @description -
 *
 * This app uses a Custom Installation page to get input from the user through
 * a color picker from element. It also dynamically populates a drop down field
 * by making an API call.
 *
 * These values are then used in the ticket details page to render the drop down
 * field value in the selected background color.
 *
 *  */

var client = null
const bodyElement = document.querySelector('body')
const bookCoverElmnt = document.querySelector('#appCaption')

var getIparams = () => {
  function setBgColour(payload) {
    bodyElement.style.backgroundColor = payload.bgColour
  }
  function setBook(payload) {
    // TO D0: Need to append div element. Currently it replaces bg with txt.
    bookCoverElmnt.textContent = `Your book is ${payload.book}`
  }
  client.iparams.get('bgColour').then(setBgColour)
  client.iparams.get('book').then(setBook)
}

var start = (app) => {
  app.initialized().then(function (_client) {
    client = _client
    client.events.on('app.activated', getIparams())
  })
}

document.addEventListener('DOMContentLoaded', start(app))
