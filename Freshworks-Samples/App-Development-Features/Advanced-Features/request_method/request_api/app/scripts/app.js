isDocumentReady();

function startAppRender() {
  app.initialized().then(function (client) {
    let options = { client: true };
    const displayElement = document.getElementById("apptext");
    client.request.get("https://xkcd.com/info.0.json", options).then(
      (data) => {
        const payload = JSON.parse(data.response);
        console.log(payload);
        displayElement.innerHTML = `<center>
                                      <a href="${payload.img}" target="_blank">
                                        <img src="${payload.img}" width="100%"></img><br/>
                                      </a>  
                                      <b>${payload.safe_title}</b><br/> 
                                      <small>(Click the image to see the cartoon)</small>
                                    </center>`;
      },
      (error) => {
        console.error("An error occurred during the request..");
        console.error(error);
      }
    );
  });
}

function isDocumentReady() {
  if (document.readyState != "loading") {
    console.info("Browser waiting until DOM loads...");
  } else {
    document.addEventListener("DOMContentLoaded", startAppRender);
  }
}
