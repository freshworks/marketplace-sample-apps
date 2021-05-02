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
  const dataMethBtn = document.querySelector('.btn-global-sidebar');
  const displayArea = document.querySelector('.display-area');
  dataMethBtn.addEventListener('fwClick', function getTktDetails() {
    /** ~ playground start of ticket details page ~ */
    
    // loggedInUser
    client.data
      .get('loggedInUser')
      .then(function renderUserBioData(payload) {
        var {
          loggedInUser: {
            contact: { name: name, job_title: job, email: email }
          }
        } = payload;
        displayArea.insertAdjacentHTML(
          'afterbegin',
          `<p>This is information received from data method:</p>
          <ul>
          <li>Name: <mark>${name}</mark></li>
          <li>Job Title: <mark> ${job} </mark></li>
          <li>Email Address: <mark> ${email} </mark></li>
          </ul>
          `
        );
      })
      .catch(console.error);

    //domainName
    client.data
      .get('domainName')
      .then(function whatsDomain({ domainName }) {
        displayArea.insertAdjacentHTML('afterend', `<br> The domain name is <mark>${domainName}</mark>`);
      })
      .catch(console.error);

    /** ~  end ~ */
  });
}
