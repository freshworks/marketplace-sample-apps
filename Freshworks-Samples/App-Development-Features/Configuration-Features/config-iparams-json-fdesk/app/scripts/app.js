var client;
var handleErr = console.error;
// All Free - https://api.publicapis.org/entries
// Free API - https://official-joke-api.appspot.com/random_joke
document.onreadystatechange = function () {
  if (document.readyState === 'interactive') renderApp();
  async function renderApp() {
    try {
      client = await app.initialized();
      client.events.on('app.activated', onAppActivate);
    } catch (error) {
      return handleErr('error details', error);
    }
  }
};

async function onAppActivate() {
  let [questionElement, answerElement] = [document.querySelector('.question'), document.querySelector('.answer')];
  var { response } = await client.request.get('https://official-joke-api.appspot.com/random_joke');
  var joke = JSON.parse(response);
  questionElement.innerText = joke.setup;
  answerElement.innerText = joke.punchline;
}
