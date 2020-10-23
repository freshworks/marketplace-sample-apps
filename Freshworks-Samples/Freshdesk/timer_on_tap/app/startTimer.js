var ready = (callback) => {
  if (document.readyState != 'loading') callback();
  else document.addEventListener('DOMContentLoaded', callback);
}

ready(() => {
  var spinner = document.querySelector('.spinner');
  var fields = document.querySelector('#fields');

  document.querySelector('#startTimer').setAttribute('disabled', false);
  document.querySelectorAll('.alert').forEach(box => { box.style.display = 'none' });

  spinner.style.display = 'block';
  fields.style.display = 'none';

  app.initialized().then(function(_client) {
    window._client = _client;
    var baseUrl = `https://<%= iparam.freshdesk_domain %>.freshdesk.com`;
    var url = `${baseUrl}/api/v2/agents`;

    console.log(url)
    var options = {
      "headers" : {
        "Content-Type": "application/json",
        "Authorization": "Basic <%= encode(iparam.freshdesk_key + ':x') %>"
      }
    };

    _client.request.get(url, options)
    .then(function(data) {
      if (data.status === 200) {
        var agentList = JSON.parse(data.response);
        for(var agent in agentList) {
          const option = document.createElement('option');
          option.text = agentList[agent].contact.name;
          option.value = agentList[agent].id;

          document.querySelector('#agent').appendChild(option);
        }
        spinner.style.display = 'none';
        fields.style.display = 'block';
      }
    }, function(error) {
      spinner.style.display = 'none';
      document.querySelector('.alert-danger').style.display = 'block';
    });
  });
});

function addTimer() {
  var agent = document.querySelector('#agent').value;
  var billable = document.querySelector('#billable').checked;
  var note = document.querySelector('#note').value;
  _client.instance.send({ message: { agent, billable, note } });
  document.querySelector('.alert-success').style.display = 'block';
  document.querySelector('#startTimer').setAttribute('disabled', true);
}