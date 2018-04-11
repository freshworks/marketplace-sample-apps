$(document).ready( function() {
    app.initialized()
        .then(function(_client) {
          var client = _client;
    
          document.getElementById("addTextToEditor").addEventListener("click", () => {
            client.interface.trigger("setValue", {id: "editor", text: "\n" + document.getElementById("final_span").innerText});
        });
    });
});

