document.addEventListener('DOMContentLoaded', function () {
  q('#startTimer').disabled = false;
  hide(q('.alert'));
  show(q('.spinner'));
  hide(q('#fields'));

  app.initialized().then(function (_client) {
    window._client = _client;
    var options = {
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Basic <%= encode(iparam.freshdesk_key + ':x') %>"
      }
    };
    _client.iparams.get("freshdesk_domain").then(function (iparam) {
      var baseUrl = `https://${iparam.freshdesk_domain}.freshdesk.com`;
      var url = `${baseUrl}/api/v2/agents`;
      _client.request.get(url, options)
        .then(function (data) {
          if (data.status === 200) {
            var agentList = JSON.parse(data.response);
            const agent = q('#agent');
            const options = agentList
              .map(agent => `<option value="${agent.id}">${agent.contact.name}</option>`)
              .join('');
            agent.innerHTML += options;
            hide(q('.spinner'));
            show(q('#fields'));
          }
        }, function (error) {
          console.error(error);
          hide(q('.spinner'));
          show(q('.alert-danger'));
        });
    });
  });
});

/**
 * Handles upon clicking the start timer icon
 */

function addTimer() {
  var agent = q('#agent').value;
  var billable = q('#billable').getAttribute('checked');
  var note = q('#note').value;
  _client.instance.send({ message: { agent, billable, note } });
  show(q('.alert-success'));
  q('#startTimer').disabled = true;
}

function q(selector) {
  return document.querySelector(selector);
}

function hide(element) {
  element.style.display = 'none';
}

function show(element) {
  element.style.display = '';
}
