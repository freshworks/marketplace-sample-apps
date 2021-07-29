function showNotification(type, message) {
  client.interface.trigger("showNotify", {
    type: type,
    message: message,
  });
}

function congoMessage(message_count) {
  return `
    <img style='height:100px; width:100px;' src='https://media4.giphy.com/media/S3nZ8V9uemShxiWX8g/giphy.gif'/>
    <h3>Congrats ! this is your ${message_count}th message in the conversation</h3>
    `;
}

function resolveConvo(event) {
  client.data.get("conversation").then((convoData) => {
    const { messages, users, agents } = convoData.conversation;
    client.interface
      .trigger("showDialog", {
        title: "Award for resolving",
        template: "modal.html",
        data: {
          customername: users[0].first_name,
          agentname: agents[0].first_name,
          messagecount: messages.length,
        },
      })
      .catch((error) => {
        console.log("problem in triggering the modal");
        console.log(error);
      });
  });

  event.helper.done();
}

function notify(event) {
  client.data.get("conversation").then((convoData) => {
    const { messages } = convoData.conversation;

    var message_milestone = messages.length;

    if (message_milestone > 1000) {
      showNotification("success", congoMessage(1000));
    } else if (message_milestone > 500) {
      showNotification("success", congoMessage(500));
    } else if (message_milestone > 250) {
      showNotification("success", congoMessage(250));
    } else if (message_milestone > 100) {
      showNotification("success", congoMessage(100));
    } else if (message_milestone > 50) {
      showNotification("success", congoMessage(50));
    } else if (message_milestone > 10) {
      showNotification("success", congoMessage(10));
    }
  });
  event.helper.done();
}

app.initialized().then(function (_client) {
  window.client = _client;
  window.client.events.on("app.activated", function () {
    client.events.on("conversation.onSendMessage", notify, {
      intercept: true,
    });
    client.events.on("conversation.onResolveClick", resolveConvo, {
      intercept: true,
    });
  });
});
