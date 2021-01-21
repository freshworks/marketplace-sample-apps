document.addEventListener("DOMContentLoaded", function () {
  const arrayModules = ["associatedTasks", "recentChildTickets", "requesterAssets", "ticketAssets"];//this array is used to check if the data api returns an array of objects
  app.initialized()
    .then(
      function (_client) {
        window.client = _client;
        eventListener();
      },
      function () {
        notify('info', 'Unable to Display Ticket Details, kindly refresh the page ');
      });

  /**
  * Function binds all events
  */
  function eventListener() {
    const codeDemoElement = document.getElementById('codeDemo');

    getData(codeDemoElement.value);

    codeDemoElement.addEventListener('fwChange', function (e) {
      console.log('change event triggered')
      console.log(e.target.value);
      getData(codeDemoElement.value);
    });
  }

  /**
   *  fucntion to fetch ticket details of the user selected input
   * @param {String} module user selected module
   */
  function getData(module) {
    client.data.get(module)
      .then(
        function (data) {
          let _data = data[module];

          if (arrayModules.indexOf(module) > -1 && _data.length) {
            _data = _data[0];
          }
          displayInHtml(_data)
        },
        function () {
          notify('info', 'unable to Display Ticket Details, kindly refresh the page ')
        });
  }

  /**
  * Function to append data into HTML
  * @param {String} data flattened string
  */
  function displayInHtml(data) {

    if (isEmpty(data)) {
      var renderOutputElement = document.getElementById('renderOutput');
      while (renderOutputElement.firstChild) {
        renderOutputElement.removeChild(renderOutputElement.firstChild);
      }
      document.getElementById('renderOutput').insertAdjacentHTML('beforeend', '<p> No Content / Unable to Show content </p>');
      document.getElementById('renderOutput').classList.remove('error');
    }
    else {
      var renderOutputElement = document.getElementById('renderOutput');
      while (renderOutputElement.firstChild) {
        renderOutputElement.removeChild(renderOutputElement.firstChild);
      }
      document.getElementById('renderOutput').classList.remove('error');
      document.getElementById('renderOutput').insertAdjacentHTML('beforeend', '<ul id="items"> </ul>');

      for (const [dataKey, dataValue] of Object.entries(data)) {
        let html = "";
        html += `<ul id="items"> <li class="clearfix"><label class="info">${dataKey}</label><label class="value">${convertToString(dataValue)}</label></li></ul>`;
        document.getElementById('items').insertAdjacentHTML('beforeend', html);
      }

    }
  }

  /**
   *  function to convert objects and arrays to string
   * @param {Object} data array or object that ought to be converted to string
   */
  function convertToString(data) {

    let dataValue = data;
    let objectToString = "";
    if (typeof dataValue == "string") {
      dataValue = dataValue.trim();
    }
    if (Array.isArray(dataValue)) {
      dataValue = dataValue.join(",");
    }
    if (typeof dataValue == "object") {
      objectToString += "<div class='nested'>" + JSON.stringify(dataValue) + "</div>";
      dataValue = objectToString;
    }
    if (dataValue == null || dataValue == "") {
      dataValue = "-";
    }
    return dataValue;
  }

  /**
   *  Helper function to check whether an object is empty
   * @param {Object} obj
   */
  function isEmpty(obj) {
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop))
        return false;
    }
    return true;
  }

  /**
   *  Funciton to diplay user notification
   * @param {string} status status, represents severity of the notification
   * @param {string} message custom message to be displated to the user
   */
  function notify(status, message) {
    client.interface.trigger('showNotify', {
      type: status,
      message: message
    });
  }
});
