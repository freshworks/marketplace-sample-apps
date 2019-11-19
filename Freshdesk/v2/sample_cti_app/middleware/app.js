const express = require('express');
const twilio = require('twilio');
const bodyParser = require('body-parser')
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(bodyParser.urlencoded({ extended: false }));

io.on('connection', (socket) => {
  socket.on('disconnect', function () {
    io.emit('user disconnected');
  });
});

http.listen(3000, function () {
  console.log('listening on http://127.0.0.1:3000');
});

app.post('/call-forward', (req, res) => {
  io.sockets.emit('incoming_call', { callInfo: req.body });
  const twiml = new twilio.twiml.VoiceResponse();
  twiml.dial({
    action: '/handle-dial-call-status',
    method: 'POST',
    timeLimit: 60
  }, '<TEST_PHONE_NUMBER_TO_RECEIVE_INCOMING_CALL>'); \
  res.type('text/xml');
  res.send(twiml.toString());
});

app.post('/handle-dial-call-status', (req, res) => {
  io.sockets.emit('handle_call_status_change', { callInfo: req.body });
  res.send({ message: 'success' });
});

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});
