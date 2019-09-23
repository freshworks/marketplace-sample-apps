$(document).ready(function () {
    init();
});

function init() {
    app.initialized().then(function (_client) {
        listGmailLabel(_client);
    });
}

function listGmailLabel(_client) {
    let client = _client;
    let headers = {
        Authorization: "bearer <%=access_token%>"
    },
        reqData = {
            headers: headers,
            isOAuth: true
        },
        url = "https://www.googleapis.com/gmail/v1/users/me/labels"
    client.request.get(url, reqData).then((listOfLabels) => {
        console.info(listOfLabels);
    }, (error) => {
        console.error('Error occured -', error);
    });
}
