var request = require('request');

exports = {
  /* Disclaimer: The use of mock servers in production environment is disallowed. HttpBin.org can be used to debug or test your app's behavior locally.
     However, this will not work when the app is deployed in a live account. 
     We recommend switching to a custom mock server controlled by you in such scenarios. */

  makeRequest: function (args) {
    request({
      url: 'https://httpbin.org/json',
      method: 'GET',
      headers: {
        Authorization: 'SDFkl2j30sd9iU#'
      }
    }, function (err, res, body) {
      if (err) {
        return renderData({
          message: 'Error while making request'
        });
      }
      renderData(null, body);
    });
  }

};
