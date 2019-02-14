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

app.post('/auth-test', (req, res) => {
  try {
    var encoded = jwt.verify(req.header('auth'), SECRET);
    console.log('>> JWT Encoded:', encoded);
    console.log('>> Data:', req.body);
    res.status(200).end();
  } catch(e) {
    console.log('>> JWT verification failed:', JSON.stringify(req.header('auth')));
    res.status(500).end();
  }
});

const port = 8000;
app.listen(port, () => {
  console.log('We are live on ' + port);
});
