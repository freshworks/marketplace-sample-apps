$(document).ready(function() {
  app.initialized().then(function(_client) {
    var client = _client;
    client.events.on('app.activated', function() {
      const data = { foo: 'bar' };

      $('.btn-ajax').off('click').click(function(){
        client.request.invoke('getJWT', {}).then(function({ response: jwt }){
          $.ajax({
            type: 'POST',
            url: 'http://localhost:8000/auth-test',
            data: data,
            headers: { auth: jwt },
          }).done(function(){
            client.interface.trigger("showNotify", {type: "success", message: "Ajax Request successful."});
          }).fail(function(){
            client.interface.trigger("showNotify", {type: "danger", message: "Ajax Request failed."});
          });
        }, function(err) {
          client.interface.trigger("showNotify", {type: "danger", message: "JWT SMI failed."});
        });
      });

      $('.btn-ajax-fail').off('click').click(function(){
        $.ajax({
          type: 'POST',
          url: 'http://localhost:8000/auth-test',
          data: data,
        }).done(function(){
          client.interface.trigger("showNotify", {type: "success", message: "Ajax Request successful."});
        }).fail(function(){
          client.interface.trigger("showNotify", {type: "danger", message: "Ajax Request failed."});
        });
      });

      $('.btn-smi').off('click').click(function(){
        client.request.invoke('sendInfoToMiddleware', data).then(function(){
          client.interface.trigger("showNotify", {type: "success", message: "SMI Request successful."});
        }, function(err) {
          client.interface.trigger("showNotify", {type: "danger", message: "SMI Request failed."});
        });
      });
    });
  });
});
