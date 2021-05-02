document.onreadystatechange = function () {
  if (document.readyState === 'interactive') renderApp();
};

function renderApp() {
  app
    .initialized()
    .then((_client) => {
      window['client'] = _client;
      client.events.on('app.activated', registerChangeEvents);
    })
    .catch(console.error);
}

function registerChangeEvents() {
  const spotlight = document.querySelector('.spotlight');

  let changeEvents = [
    'ticket.priorityChanged',
    'ticket.statusChanged',
    'ticket.groupChanged',
    'ticket.agentChanged',
    'ticket.typeChagned'
  ];

  changeEvents.forEach(function register(click) {
    client.events.on(click, function writeToDOM(event) {
      let eventName = event.type;
      let { old: prevVal, new: newVal } = event.helper.getData();
      const row = `
          <tr>
            <td>${prevVal}</td>
            <td>${newVal}</td>
            <td>${eventName.slice(7)}</td>
          </tr>
      `;
      spotlight.insertAdjacentHTML('beforeend', row);
    });
  });
}
