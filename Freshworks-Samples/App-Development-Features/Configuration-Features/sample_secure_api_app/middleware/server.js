const jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const SECRET = 'secretKey77';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function auth (req, res, next) {
  try {
    let encoded = jwt.verify(req.header('auth'), SECRET);
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

app.listen(8000, () => {
  console.log('We are live on ' + port);
});
