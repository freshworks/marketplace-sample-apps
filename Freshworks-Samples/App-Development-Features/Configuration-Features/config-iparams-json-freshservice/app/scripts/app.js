document.onreadystatechange = whenInteractive;

function whenInteractive() {
  if (document.readyState === 'interactive') {
    return app.initialized().then(getClientAPI).catch(console.error);
  }
}

function getClientAPI(_client) {
  window.client = _client;
  // For apps those run in background,the callback is invoked everytime page is opened by the Freshdesk Agent.
  client.events.on('app.activated', makeAPIcall);
}

function getOmnitrix() {
   client.iparams.get('omnitrix').then(function(iparams) {
   omnitrix =  iparams.omnitrix;
})
}

function makeAPIcall() {
  const URL = 'https://<%= iparam.creatorDomain %>.freshservice.com/api/v2/agents/<%= iparam.agent_id %>';
  var options = {
    headers: {
      Authorization: `Basic <%= encode(iparam.api_key) %>`, // substitution happens by platform
      'Content-Type': 'application/json'
    }
  };
  client.iparams.get('omnitrix').then(function(iparams) {
    omnitrix =  iparams.omnitrix;
 })
  client.request
    .get(URL, options)
    .then(function ({ response }) {
      let agentData = JSON.parse(response);
      document.getElementById('apptext').innerText = `Hey ${agentData['agent']['first_name']},  ${omnitrix} is my fav transformation too`
      console.log("Agents: ", agentData['agent']['first_name'])
      
    })
    .catch(console.error);

}