/**
 * This app analyses the ticket sentiment of the requestor and rates it. It can
 * tell you if the tone of the message is angry, sad, indifferent or happy.
 */

$(document).ready(() => {
  app.initialized().then( (_client) => {
      window.client = _client;
      client.events.on('app.activated',
         () => {
          calculateSentiment();
        },
         (error) => {
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

  /**Finds the score */
  function findScore(phrase) {
    let tokens = tokenize(phrase),score = 0;
    let len = tokens.length;

    while (len--) {
      let obj = tokens[len];
      if (!AFINN.hasOwnProperty(obj)) {
        continue;
      }

      let item = AFINN[obj];
      score += item;
    }

    return score;
  }

  /** Assign setiment value depending upon the score. */
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
    client.data.get("ticket").then((ticketDetail) => {
        client.data.get("domainName").then((domainDetail) => {
            let dataUrl = `https://${domainDetail.domainName}/api/v2/tickets/${ticketDetail.ticket.id}?include=conversations`;
            let headers = { "Authorization": "Basic <%= encode(iparam.apiKey) %>" };
            let options = { headers: headers };

            client.request.get(dataUrl, options)
              .then((data) => {
                  calculateSentimentFromData(JSON.parse(data.response));
                },
                 (error) => {
                  notifyError();
                }
              );
          },
          (error) => {
            notifyError();
          }
        );
      },
       (error) => {
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

    let averageScore = 0;
    for (let i = scores.length - 1; i >= 0; i--) {
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

  /**@fires - A Notification with Danger Label */
  function notifyError() {
    client.interface.trigger("showNotify", { 
      type: "Danger", 
      title: "Sentimental Jeff Error", 
      message: error.message
    });
  }
});
