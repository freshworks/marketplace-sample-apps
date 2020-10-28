/*
 * Sample code to demonstrate Authentication for Freshchat
 * 
 * This is sample app to demonstrate Freshchat authentication. It authenticates the user and displays the 
 * list of all agents configured by the business that uses Freshchat.
 */

/**
 * Opens and sends the data to Agents dialog once the show all agents button is clicked.
 * @param {*} data 
 */
let showDialog = (data) => {
    client.interface.trigger("showDialog", {
        title: "All Agents",
        template: "dialog.html",
        data: data
    }).then(function (data) {

    }).catch(function (error) {
    });
}

/**
 * Register the click handler to list all agents
 * @param {*} data
 */
let listAllAgents = (data) => {
    let listAgentsBtn = document.getElementById('listagents-btn');
    listAgentsBtn.addEventListener("click", showDialog.bind(null, data));
}

/* 
 * Shows error message to user/agent
 * @param {*} error
 */
let showError = (error) => {
    let reponse = JSON.parse(error.response);
    //Notify the agent/user that something went wrong while fetching the data.
    client.interface.trigger("showNotify", {
        type: "danger",
        message: reponse["errorMessage"] || "Error occured while fetching data"
    });
    let listAgentsBtn = document.getElementById('listagents-btn');
    listAgentsBtn.style.display = "none";
    let errorMsg = `<img src="error.png" height=35" width="35" /> ${reponse["errorMessage"]} <br>
    Error occured while fetching data`;
    document.getElementById('error').innerHTML = errorMsg;
}


app.initialized()
    .then(function (_client) {
        window.client = _client;
        client.events.on('app.activated',
            function () {
                let headers = { "Authorization": "Bearer <%= iparam.apiKey %>" };
                let options = { headers: headers };
                let url = "https://api.freshchat.com/v2/agents?items_per_page=6";
                //Calls the agents API and renders the view based on the response
                client.request.get(url, options)
                    .then((data) => {
                        let response = JSON.parse(data.response);
                        //on success 
                        listAllAgents(response);
                    }).catch((error) => {
                        //on failure 
                        showError(error);
                    });
                //shows currently logged-in agent.
                client.data.get('loggedInAgent')
                    .then(function (data) {
                        $('#apptext').text("Agent logged in is " + data.loggedInAgent.email);
                    })
                    .catch(function (e) {
                        // Logs and Notifies the user/agent that something went wrong while retrieving logged-in agent
                        client.interface.trigger("showNotify", {
                            type: "danger",
                            message: "Unable to retrieve logged-in agent details"
                        });
                        console.log('Exception - ', e);
                    });
            });
    });

