$(document).ready( function() {
  jQuery('#startTimer').attr('disabled', false);
  jQuery('.alert').hide();
  jQuery('.spinner').show();
  jQuery('#fields').hide();
  // Initialize channel
  app.initialized().then(function(_client) {
    window._client = _client;

    // request api to get agent list and populate them
    var baseUrl = `https://<%= iparam.freshdesk_domain %>.freshdesk.com`;
    var url = `${baseUrl}/api/v2/agents`;
    var options = {
      "headers" : {
        "Content-Type": "application/json",
        "Authorization": "Basic <%= encode(iparam.freshdesk_key + ':x') %>"
      }
    };
    _client.request.get(url, options) // to load all time-entries for the ticket
    .then(function(data) {
      if (data.status === 200) {
        var agentList = JSON.parse(data.response);
        for(var agent in agentList) {
          jQuery('#agent').append(
          jQuery('<option/>')
          .attr('value', agentList[agent].id)
          .text(agentList[agent].contact.name));
        }
        jQuery('.spinner').hide();
        jQuery('#fields').show();
      }
    }, function(error) {
      jQuery('.spinner').hide();
      jQuery('.alert-danger').show();
    });
  });
});
function addTimer() {
  var agent = jQuery('#agent').val();
  var billable = jQuery('#billable').is(':checked');
  var note = jQuery('#note').val();
  // Interface API is not supported in modal. So, sending params to the app.
  _client.instance.send({ message: { agent, billable, note } });
  jQuery('.alert-success').show();
  jQuery('#startTimer').attr('disabled', true);
}