function init(client) {
  function showError(message) {
    client.interface.trigger('showNotify', { type: 'danger', message })
  }

  client.data.get('domainName').then(function({ domainName }) {
    // ----------------------------
    // NOTE: cti is a mock object, you must replace with the correct sdk
    // ----------------------------

    function onCallEnd(phone) {
      client.instance.resize({ height: '270px' });
      $('.call-container, .btn-simulate').hide();
      $('.ticket-create-container').removeClass('hide');
      $('.contact-phone').val(phone);
      $('.btn-skip').click(() => window.location.reload());
      $('.btn-create').click(function(){
        const options = {
          headers: {
            Authorization: 'Basic <%= encode(iparam.api_key) %>',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: $('.contact-name').val(),
            email: $('.contact-email').val(),
            phone: $('.contact-phone').val(),
            subject: $('.ticket-subject').val(),
            description: $('.ticket-desc').val(),
            status: 2,
            priority: 1,
          }),
        }
        client.request.post(`https://${domainName}/api/v2/tickets`, options)
        .then(data => {
          var ticket = JSON.parse(data.response);
          client.interface.trigger('showNotify', { type: 'success', message: 'Ticket created' })
          client.interface.trigger('click', {id: 'ticket', value: ticket.id });
          client.interface.trigger('hide', { id: 'softphone' });
          window.location.reload();
        })
        .catch(err => showError(err.response));
      });
    }

    cti.onCallReceieve(function(phone){
      $('h4').text('Incoming Call');
      $('input.phone').attr('disabled', true).val(phone);
      $('.btn-call, .btn-end').addClass('hide');
      $('.btn-attend').removeClass('hide');
      const openPopupTimer = setInterval(function(){
        client.interface.trigger('show', { id: 'softphone' });
      }, 1000);
      $('audio')[0].play();
      $('.btn-attend').click(function(){
        clearInterval(openPopupTimer);
        $('h4').text('Call in progress');
        $('audio')[0].currentTime = 0;
        $('audio')[0].pause();
        $('.btn-attend').addClass('hide');
        $('.btn-end').removeClass('hide');
      })
    }).onEnd(onCallEnd);

    $('.btn-call').click(function(){
      $('.btn-call, .btn-attend').addClass('hide');
      $('.btn-end').removeClass('hide');
      $('input.phone').attr('disabled', true);
      $('h4').text('Call in progress');
      cti.call($('input.phone').val()).onEnd(onCallEnd);
    });

    $('.btn-end').click(function(){
      $('input.phone').attr('disabled', false);
      cti._end($('input.phone').val())
    });

    $('.btn-simulate').click(function(){
      setTimeout(function(){
        cti._call('+1 716 817 4864');
      }, 2000);
    });
  }).catch(err => showError('Error getting domainName' + err))
}

$(document).ready( function() {
  app.initialized().then(function(client) {
    client.instance.resize({ height: '120px' })
    client.events.on('app.activated', init(client))
  }).catch(err => showError('Error initializing' + err))
})
