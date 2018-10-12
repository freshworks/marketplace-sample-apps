$(document).ready( function() {
  app.initialized().then(function(_client) {
    var client = _client;
    client.events.on('app.activated', function() {
      client.data.get('domainName').then(function(data) {
        $('#domain .label').html(data.domainName);
      }, function(err) {
        client.interface.trigger('showNotify', {
          type: 'danger',
          message: 'User domainName request failed.'
        });
        console.error('User domainName request failed.', err);
      });

      var options = { headers: {'Authorization': 'Basic <%= encode(iparam.api_key) %>', 'Content-Type': 'application/json' } };
      Promise.all([2,3,4,5].map(function(status){
        const url = `https://marketplaceprod1.freshdesk.com/api/v2/search/tickets?query="status:${status}"`;
        return client.request.get(url, options);
      })).then(function(responses){
        render(responses);
      }).catch(function(err){
        client.interface.trigger('showNotify', {
          type: 'danger',
          message: 'API request(s) failed.'
        });
        console.error('API request(s) failed.', err);
      });
    });

    function render(responses) {
      const data = responses.map(function(r){ return JSON.parse(r.response)});
      const max = Math.max.apply(Math, data.map(function(d){ return d.total; }));
      data.forEach(function(res, i) {
        const $status = $('#chart > .status').eq(i);
        $status.find('.status-bar').css('height', `${parseInt(res.total * 100 / max)}%`);
        $status.find('.status-value').html(res.total);
      });
      $('.status').click(function(){
        $('#chart').addClass('minimize');
        $('.status').removeClass('active');
        $(this).addClass('active');
        const tickets = data[$(this).data('index')].results;
        $('#ticket-list').html(`
          <table>
            <tbody>
              ${tickets.map(function(ticket) {
                return `
                  <tr class="ticket" data-id="${ticket.id}">
                    <td class="subject">${ticket.subject}</td>
                    <td class="priority priority-${ticket.priority}">
                      ${([, 'Low', 'Medium', 'High', 'Urgent'])[ticket.priority] || 'N/A'}
                    </td>
                    <td class="created-at">${(new Date(ticket.created_at)).toDateString()}</td>
                  </tr>
                `
              }).join('')}
            </tbody>
          </table>
        `);
        $('.ticket').click(function(){
          client.interface.trigger('click', {id: 'ticket', value: +$(this).data('id') });
        });
      });
    }
  }).catch(function(err){
    client.interface.trigger('showNotify', {
      type: 'danger',
      message: 'App activation failed.'
    });
    console.error('App activation failed.', err);
  });
});
