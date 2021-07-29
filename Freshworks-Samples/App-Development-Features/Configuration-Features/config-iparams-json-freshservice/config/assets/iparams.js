document.onreadystatechange = function () {
  if (document.readyState === "interactive") renderApp();
  async function renderApp() {
    try {
      client = await app.initialized();
      console.log(client);
    } catch (error) {
      return handleErr("error details", error);
    }
  }
};

function checkSignature(sign) {
  return sign.toLowerCase() == "azmuth" ? "" : "Wrong Signature";
}
