var tdna = new TypingDNA();
var client;

var errorHandler = console.error;
var logger = console.log;

function addListener(classname, handler) {
  document
    .querySelector(String(classname))
    .addEventListener('fwChange', handler);
}

function handleLocalStorage(key) {
  if (
    localStorage.getItem(String(key)) == 'true' ||
    localStorage.getItem(String(key)) == null
  ) {
    console.log('setting item to false');
    localStorage.setItem(String(key), 'false');
  } else {
    localStorage.setItem(String(key), 'true');
  }
}

addListener('.interceptSendReply', () => {
  handleLocalStorage('shouldInterceptReply');
});

addListener('.interceptDelTkt', () => {
  handleLocalStorage('shouldInterceptDelete');
});

addListener('.interceptPropUpdated', () => {
  handleLocalStorage('shouldInterceptUpdate');
});

addListener('.interceptCloseTkt', () => {
  handleLocalStorage('interceptCloseTkt');
});

document.onreadystatechange = function() {
  if (document.readyState == 'complete') startAppRender();

  function startAppRender() {
    logger('app started rendering..')
    var onInit = app.initialized();
    var quoteTwoBtn = document.querySelector('.quote-two');
    var saveSettings = document.querySelector('.saveSettings');

    onInit.then(getClientObj);

    function getClientObj(_client) {
      var secondQuote;
      client = _client;
      secondQuote = localStorage.getItem('secondQuote');
      quoteTwoBtn.innerText = secondQuote;
      saveSettings.addEventListener('click', saveSecondPattern);

      function saveSecondPattern() {
        var pattern2 = tdna.getTypingPattern({
          type: 1,
          text: String(secondQuote)
        });
        localStorage.setItem('secondPattern', pattern2);
        client.instance.close();
      }
    }
  }
};
