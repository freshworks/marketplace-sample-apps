const jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const SECRET = 'secretKey77';

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,auth');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

function auth (req, res, next) {
  try {
    var encoded = jwt.verify(req.header('auth'), SECRET);
    console.log('>> JWT payload:', encoded);
    return next();
  } catch(e) {
    console.log('>> JWT verification failed:', JSON.stringify(req.header('auth')));
    return res.status(500).end();
  }
}

app.post('/auth-test', auth, (req, res) => {
  console.log('>> Data:', req.body);
  res.json({ message: 'ok' }).end();
});

const port = 8000;
app.listen(port, () => {
  console.log('We are live on ' + port);
});
