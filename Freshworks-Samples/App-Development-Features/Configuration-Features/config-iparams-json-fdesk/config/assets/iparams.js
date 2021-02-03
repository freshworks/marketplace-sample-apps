document.onreadystatechange = function () {
  if (document.readyState === 'interactive') renderApp();
  async function renderApp() {
    try {
      client = await app.initialized();
      console.log(client);
    } catch (error) {
      return handleErr('error details', error);
    }
  }
};

function checkSignature(sign) {
  var alienName = utils.get('omnitrix');
  return sign.toLowerCase() == 'azmuth' ? `Transformed into ${alienName}` : `Wrong signature`;
}
