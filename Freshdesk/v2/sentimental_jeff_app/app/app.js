$(document).ready(function () {
  app.initialized()
    .then(function (_client) {
      window.client = _client;
      client.events.on('app.activated',
        function () {
          calculateSentiment();
        },
        function (error) {
          notifyError();
        });
    });


  function tokenize(input) {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9\- ]+/g, '')
      .replace('/ {2,}/', ' ')
      .split(' ');
  }

  function findScore(phrase) {
    var tokens = tokenize(phrase),
      score = 0;

    var len = tokens.length;
    while (len--) {
      var obj = tokens[len];
      if (!AFINN.hasOwnProperty(obj)) {
        continue;
      }

      var item = AFINN[obj];
      score += item;
    }

    return score;
  }

  function findSentiment(score) {
    var sentiment = "";
    if (score > 2) {
      sentiment = "yay";
    } else if (score <= 2 && score > -2) {
      sentiment = "blah";
    } else if (score <= -2 && score > -5) {
      sentiment = "sad";
    } else if (score <= -5) {
      sentiment = "angry";
    }
    sentiment = 'emoji--' + sentiment;
    return sentiment;
  }

  function calculateSentiment() {
    client.data.get("ticket").then(
      function (ticketDetail) {
        client.data.get("domainName").then(
          function (domainDetail) {
            let dataUrl = `https://${domainDetail.domainName}/api/v2/tickets/${ticketDetail.ticket.id}?include=conversations`;

            let headers = { "Authorization": "Basic <%= encode(iparam.apiKey) %>" };
            let options = { headers: headers };

            client.request.get(dataUrl, options)
              .then(
                function (data) {
                  calculateSentimentFromData(JSON.parse(data.response));
                },
                function (error) {
                  notifyError();
                }
              );
          },
          function (error) {
            notifyError();
          }
        );
      },
      function (error) {
        notifyError();
      }
    );

  }

  function calculateSentimentFromData(data) {
    let requesterId = data.requester_id;
    let scores = [];
    scores.push(findScore(data.subject));
    scores.push(findScore(data.description_text));
    data.conversations.filter(converstation => converstation.user_id === requesterId).forEach(conversation => {
      scores.push(findScore(conversation.body_text));
    });

    var averageScore = 0;
    for (var i = scores.length - 1; i >= 0; i--) {
      averageScore += scores[i] * (i + 1);
    }
    averageScore /= scores.length * (scores.length + 1) / 2;
    let sentiment = 'single';
    let sentimentValue = findSentiment(averageScore);
    if (sentimentValue === 'emoji--blah') {
      $(`#neutral-emoji`).removeClass('display-none');
    }
    else {
      $('#one-sentiment').removeClass('display-none');
      $(`.emoji[sentiment=${sentiment}]`).addClass(findSentiment(averageScore));
    }

    $(`#spinner`).addClass('display-none');
  }

  function notifyError() {
    client.interface.trigger("showNotify", { type: "Danger", title: "Sentimental Jeff Error", message: error.message });
  }
});
