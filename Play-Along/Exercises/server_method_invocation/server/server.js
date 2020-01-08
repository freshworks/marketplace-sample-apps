var request = require('request');

exports = {

  makeRequest: function(args) {
    request({
      url: 'https://httpbin.org/json',
      method: 'GET',
      headers: {
        Authorization: 'SDFkl2j30sd9iU#'
      }
    }, function(err, res, body) {
      if (err) {
        return renderData({
          message: 'Error while making request'
        });
      }
      renderData(null, body);
    });
  }

};
