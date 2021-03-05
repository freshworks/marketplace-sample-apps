document.onreadystatechange = function () {
  if (document.readyState === 'interactive') renderApp();
};

async function renderApp() {
  let _client = await app.initialized();
  window['client'] = _client;
  client.events.on('app.activated', renderSidebar);
  return;
}

function renderSidebar() {
  const dataMethBtn = document.querySelector('.btn-ticket-details');
  const space = document.querySelector('.space');
  dataMethBtn.addEventListener('fwClick', function getTktDetails() {
    /** ~ playground start of ticket details page ~ */

    // ticket
    client.data
      .get('ticket')
      .then(function getDetails({ ticket: { description_text: desc, priority: priority } }) {
        space.insertAdjacentHTML(
          'afterbegin',
          `<li><i>"ticket"</i> priority: <mark>${priority}</mark> : desc: <mark>${desc}</mark></li>`
        );
      })
      .catch(console.error);

    //contact
    client.data
      .get('contact')
      .then(function getDetails({ contact: { address: address, name: name } }) {
        space.insertAdjacentHTML(
          'afterbegin',
          `<li><i>"contact"</i> address: <mark>${address}</mark> name: <mark>${name}</mark></li>`
        );
      })
      .catch(console.error);

    // email_config
    client.data
      .get('email_config')
      .then(function getDetails(payload) {
        let supportEmail = payload.email_config[0].replyEmail;
        space.insertAdjacentHTML('afterbegin', `<li><i>"email_config"</i> : <mark>${supportEmail}<mark></li>`);
      })
      .catch(console.error);

    //requester
    client.data
      .get('requester')
      .then(function getDetails(payload) {
        let name = payload.requester.name;
        space.insertAdjacentHTML('afterbegin', `<li><i>"requester"</i> : <mark>${name}<mark></li>`);
      })
      .catch(console.error);

    //requester
    client.data
      .get('company')
      .then(function getDetails(payload) {
        let name = payload.company.name;
        space.insertAdjacentHTML('afterbegin', `<li><i>"company"</i> : <mark>${name}<mark></li>`);
      })
      .catch(console.error);

    //requester
    client.data
      .get('group')
      .then(function getDetails(payload) {
        let name = payload.group.name;
        space.insertAdjacentHTML('afterbegin', `<li><i>"group"</i> : <mark>${name}<mark></li>`);
      })
      .catch(console.error);

    //requester
    client.data
      .get('company')
      .then(function getDetails(payload) {
        let name = payload.company.name;
        space.insertAdjacentHTML('afterbegin', `<li><i>"company"</i> : <mark>${name}<mark></li>`);
      })
      .catch(console.error);

    //status_options
    client.data
      .get('status_options')
      .then(function getDetails(payload) {
        let opt = payload.status_options[0];
        space.insertAdjacentHTML('afterbegin', `<li><i>"status options"</i> First option: <mark>${opt}<mark></li>`);
      })
      .catch(console.error);

    //time_entry
    client.data
      .get('time_entry')
      .then(function getDetails(payload) {
        let isTimerRunning = payload.time_entry.time_entries[0].time_spent;
        space.insertAdjacentHTML(
          'afterbegin',
          `<li><i>"time entry"</i> First option: <mark>${isTimerRunning}<mark></li>`
        );
      })
      .catch(console.error);
    /** ~  end ~ */
  });
}
