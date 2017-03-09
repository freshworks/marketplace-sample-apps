
var request = loadDependency('request');
var requestData = loadLib('req-data');

exports = {

  sendSMS: function(args) {
    var reqData = requestData(args);
    // making the api call using the request npm.
    request( reqData, function(err, resp, body) {
      // using renderData to send back the response.
      if (err) { return renderData(err); }
      if (resp.statusCode == 201) {
        return renderData(null, body);
      } else {
        var err = {
          status: resp.statusCode, 
          message: body
        };
        return renderData(err);
      }
    });
  }

};
