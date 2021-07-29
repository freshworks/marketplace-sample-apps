/**
 * Words used for Sentiment analysis result
 */
const SENTIMENTS = {
  positive: "positive",
  negative: "negative",
  neutral: "neutral",
};

/**
 * It shows a toast notification with the given error message.
 *
 * @param {string} error - Error message to be displayed
 */
function notifyError(error) {
  client.interface.trigger("showNotify", {
    type: "danger",
    title: "Sentimental Jeff Error",
    message: error,
  });
}

/**
 * It tokenises the given phrase.
 * The words are split into meaningful word tokens to compare against the words list to find out sentiment of the particular words.
 *
 * @param {string} input - Phrase to tokenize
 * @returns {string[]} words tokens from the given phrase
 */
function tokenize(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\- ]+/g, "")
    .replace("/ {2,}/", " ")
    .split(" ");
}

/**
 * It tokenises the given phrase to take out emoticons.
 * It splits the emoticons out of the given phrase to compare against the list of emoticons to find out the sentiment score for the particular emoticons.
 *
 * @param {string} input - Phrase to tokenize emoticons
 * @returns {string[]} emoticons tokens from the given phrase
 */
function emoticons(input) {
  return input
    .replace(/[^DPpSoOXx38\-=:;'()[\]/\\|^<>*{} ]+/g, "")
    .replace("/ {2,}/", " ")
    .split(" ");
}

/**
 * It calculates the sentiment score for the given phrase
 *
 * @param {string} phrase - Phrase to calculate sentiment score
 * @returns {number} Sentiment score
 */
function findScore(phrase) {
  const tokens = tokenize(phrase);
  const emoticonTokens = emoticons(phrase);
  let score = 0;

  /* Find if the word tokens are available in the AFINN words list and add relevant score for the matching word. */
  let token;
  for (token of tokens) {
    if (AFINN.hasOwnProperty(token)) {
      score += AFINN[token];
    }
  }

  /* Find if the emoticon tokens are available in the AFINN emoticons list and add relevant score for the matching emoticon. */
  let emoticonToken;
  for (emoticonToken of emoticonTokens) {
    if (AFINN_EMOTICON.hasOwnProperty(emoticonToken)) {
      score += AFINN_EMOTICON[emoticonToken];
    }
  }

  return score;
}

/**
 * It returns positive, negartive or neutral sentiment based on the given score.
 * It returns neutral if the resulting score in zero and positive and negative for respective scores.
 *
 * @param {number} score - Sentiment score
 * @returns {string} Sentiment of the given score
 */
function sentiment(score) {
  if (score > 0) {
    return SENTIMENTS.positive;
  } else if (score < 0) {
    return SENTIMENTS.negative;
  } else {
    return SENTIMENTS.neutral;
  }
}

/**
 * It checks for the configured custom field to update the sentiment result and update the field with the sentiment result string.
 *
 * @param {string} domain - Domain of the Freshdesk instance
 * @param {object} ticket - Current ticket details
 * @param {string} sentiment - Sentiment of this ticket
 */
function updateTicketField(domain, ticket, sentiment) {
  client.iparams.get("sentimentField").then(
    (iparams) => {
      if (iparams.sentimentField && iparams.sentimentField !== "") {
        if (ticket.custom_fields[iparams.sentimentField] !== sentiment) {
          const url = `https://${domain}/api/v2/tickets/${ticket["id"]}`;
          const options = {
            headers: {
              Authorization: "Basic <%= encode(iparam.apiKey) %>",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              priority: ticket.priority,
              status: ticket.status,
              custom_fields: {
                [iparams.sentimentField]: sentiment,
              },
            }),
          };
          client.request.put(url, options).then(
            () => {
              console.info(
                "Success: Updated the ticket field with the sentiment analysis result"
              );
            },
            (error) => {
              console.error(
                "Error: Unable to update the ticket field with the sentiment analysis result"
              );
              console.error(error);
              notifyError(
                "Failed to update sentiment result to the configured ticket field."
              );
            }
          );
        }
      } else {
        console.info(
          "Skipped updating sentiment to a ticket custom field as not opted for it."
        );
      }
    },
    (error) => {
      console.error(
        "Error: Failed to get the configured ticket field to update sentiment"
      );
      console.error(error);
    }
  );
}

/**
 * It calculates the sentiment for the given ticket details and show relevant emoji.
 *
 * @param {object} data - Ticket details to calculate sentiment score for.
 * @returns {string} Sentiment of the ticket
 */
function calculateSentimentFromData(data) {
  const requesterId = data.requester_id;
  let scores = [];
  scores.push(findScore(data.subject));
  scores.push(findScore(data.description_text));

  /* Calculates sentiment score only for the conversation from the customer and avoiding the conversation from the agent */
  data.conversations
    .filter((converstation) => converstation.user_id === requesterId)
    .forEach((conversation) => {
      scores.push(findScore(conversation.body_text));
    });

  let averageScore = 0;
  for (let i = scores.length - 1; i >= 0; i--) {
    averageScore += scores[i];
  }
  averageScore /= scores.length;
  const sentimentText = sentiment(averageScore);

  /* Displays relevant section for the sentiment */
  if (sentimentText === SENTIMENTS.positive) {
    document.getElementById("one-sentiment").classList.remove("display-none");
    document
      .querySelector(`.emoji[sentiment=single]`)
      .classList.add("emoji--happy");
  } else if (sentimentText === SENTIMENTS.negative) {
    document.getElementById("one-sentiment").classList.remove("display-none");
    document
      .querySelector(`.emoji[sentiment=single]`)
      .classList.add("emoji--sad");
  } else {
    document.getElementById("neutral-emoji").classList.remove("display-none");
  }
  document.getElementById("spinner").classList.add("display-none");
  return sentimentText;
}

/**
 * This method fetches ticket details and calculates sentiment for it. Then updates it to a ticket field if opted.
 */
function calculateAndUpdateSentiment() {
  client.data.get("ticket").then(
    (ticketDetail) => {
      client.data.get("domainName").then(
        (domainDetail) => {
          const dataUrl = `https://${domainDetail.domainName}/api/v2/tickets/${ticketDetail.ticket.id}?include=conversations`;
          const options = {
            headers: {
              Authorization: "Basic <%= encode(iparam.apiKey) %>",
            },
          };
          client.request.get(dataUrl, options).then(
            (data) => {
              const sentimentText = calculateSentimentFromData(
                JSON.parse(data.response)
              );
              updateTicketField(
                domainDetail.domainName,
                ticketDetail.ticket,
                sentimentText
              );
            },
            (error) => {
              console.error("Error fetching the ticket details");
              console.error(error);
              notifyError("Failed to get ticket details.");
            }
          );
        },
        (error) => {
          console.error("Error: Failed to get the domain.");
          console.error(error);
        }
      );
    },
    (error) => {
      console.error("Error: Failed to get ticket details with Data method.");
      console.error(error);
    }
  );
}

document.addEventListener("DOMContentLoaded", function () {
  app
    .initialized()
    .then((_client) => {
      window.client = _client;
      client.events.on(
        "app.activated",
        () => {
          calculateAndUpdateSentiment();
        },
        (error) => {
          console.error("Error: Failed to load the app.");
          console.error(error);
          notifyError("Failed to load the app.");
        }
      );
    })
    .catch(function (error) {
      console.error("Error: Sentimental Jeff app failed to render");
      console.error(error);
    });
});
