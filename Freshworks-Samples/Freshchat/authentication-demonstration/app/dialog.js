/**
 * shows all the Agents in the UI
 * @param {*} agents 
 */
let showAgents = (agents) => {
    let table = document.getElementsByTagName('tbody')[0].innerHTML;
    agents.forEach(function (item) {
        let groups = "";
        item['groups'].forEach(function (grp) {
            groups = groups + grp + ',';
        });
        table = table + `<tr>
        <td>${item['first_name']}</td>
        <td>${item['email']}</td>
        <td>${item['role_name']}</td>
        <td>${groups.trim().length > 0 ? groups : '-'}</td>
      </tr>`;
    });
    document.getElementsByTagName('table')[0].innerHTML = table;
}

app.initialized()
    .then(function (_client) {
        window.client = _client;
        //Retrieves the data within the Agents dialog box
        client.instance.context().then(function (context) {
            //On success displays all the agents
            showAgents(context.data["agents"]);
        }).catch(function (error) {
            //On failure notifies the error message to the user
            client.interface.trigger("showNotify", {
                type: "danger",
                message: "Error occured while retriving data"
            });
            console.log(error);
        });
    });
