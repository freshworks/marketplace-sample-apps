var jwt = require('jsonwebtoken');
var request = require('request');
const SECRET = 'secretKey77';
const JWTpayload = { type: 'jwt' };

exports = {

  sendInfoToMiddleware: function(data) {
    request.post({
      url: 'http://localhost:8000/auth-test',
      form: { foo: 'bar' },
      headers: {
        auth: jwt.sign(JWTpayload, SECRET, { expiresIn: '1h' })
      }
    }, function (error, response) {
      renderData(error, response);
    });
  }

};
