var tdna = new TypingDNA();
var client;

var errorHandler = console.error;
var logger = console.log;

function addListener(classname, handler) {
  document.querySelector(String(classname)).addEventListener('fwChange', handler);
}

async function handleLocalStorage(key) {
  let isKeyVal = await client.db.get(String(key));
  if (isKeyVal == 'true' || isKeyVal == null) {
    console.log('setting item to false');
    await client.db.set(String(key), 'false', { setIf: 'not_exist' });
  } else {
    await client.db.set(String(key), 'true');
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

document.onreadystatechange = function () {
  if (document.readyState == 'complete') startAppRender();

  function startAppRender() {
    logger('app started rendering..');
    var onInit = app.initialized();
    var quoteTwoBtn = document.querySelector('.quote-two');
    var saveSettings = document.querySelector('.saveSettings');

    onInit.then(getClientObj);

    async function getClientObj(_client) {
      var secondQuote;
      client = _client;
      secondQuote = await client.db.get('secondQuote');
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
