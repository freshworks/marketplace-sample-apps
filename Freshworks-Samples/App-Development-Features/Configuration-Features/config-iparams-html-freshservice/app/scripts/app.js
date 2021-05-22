function getJoke() {
  const JOKE_ENDPOINT = "https://official-joke-api.appspot.com/random_joke";
  client.request.get(JOKE_ENDPOINT).then(function (data) {
    showSpinner(data);
    const setup = JSON.parse(data.response).setup;
    const punchline = JSON.parse(data.response).punchline;
    displayPunchline(punchline);
    pick(".card").style.display = "block";
    pick(
      "#setup"
    ).innerHTML = `<fw-label value="Question:" color="red"></fw-label> ${setup}`;
  }),
    function (error) {
      console.error("Error fetching data from endpoint", error);
    };
}

function showSpinner(data) {
  if (data) {
    pick(".spinner-div").style.display = "none";
  }
}

function displayPunchline(punchline) {
  pick("#punchline-btn").addEventListener("click", function () {
    pick(
      "#punchline"
    ).innerHTML = `<fw-label value="${punchline}" color="green"></fw-label>`;
  });
}

function pick(selector) {
  return document.querySelector(selector);
}

document.onreadystatechange = function () {
  if (document.readyState === "interactive") renderApp();

  function renderApp() {
    var onInit = app.initialized();
    onInit.then(getClient).catch(handleErr);

    function getClient(_client) {
      window.client = _client;
      client.events.on("app.activated", onAppActivate);
    }
  }
};

function onAppActivate() {
  getJoke();
}

function handleErr(err) {
  console.error(`Error occurred. Details:`, err);
}
