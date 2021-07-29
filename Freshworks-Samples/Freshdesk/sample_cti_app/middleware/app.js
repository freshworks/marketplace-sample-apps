const express = require("express");
const twilio = require("twilio");
const bodyParser = require("body-parser");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(bodyParser.urlencoded({ extended: false }));

/**
 * Creates websocket connection using socket.io
 *
 * @param {WebSocket} socket - websocket connection
 **/
io.on("connection", (socket) => {
  socket.on("disconnect", function () {
    io.emit("user disconnected");
  });
});

/**
 * Starts a HTTP server
 **/
http.listen(3000, function () {
  console.log("listening on http://127.0.0.1:3000");
});

/**
 * API to lister to call forward request
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 **/
app.post("/call-forward", (req, res) => {
  io.sockets.emit("incoming_call", { callInfo: req.body });
  const twiml = new twilio.twiml.VoiceResponse();
  twiml.dial(
    {
      action: "/handle-dial-call-status",
      method: "POST",
      timeLimit: 60,
    },
    "<TEST_PHONE_NUMBER_TO_RECEIVE_INCOMING_CALLS>"
  );
  res.type("text/xml");
  res.send(twiml.toString());
});

/**
 * API to lister to call forward request to agent
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 **/
app.post("/connect-agent", (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();
  twiml.dial(
    {
      action: "/handle-dial-call-status",
      method: "POST",
      timeLimit: 60,
      callerId: req.body.To,
    },
    "<TEST_PHONE_NUMBER_TO_RECEIVE_INCOMING_CALLS>"
  );
  res.type("text/xml");
  res.send(twiml.toString());
});

/**
 * API to lister to call status change events and send it to the CTI app in Freshdesk
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 **/
app.post("/handle-dial-call-status", (req, res) => {
  io.sockets.emit("handle_call_status_change", { callInfo: req.body });
  res.send({ message: "success" });
});

/**
 * Default express middleware to catch unhandled errors
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Object} next - response object
 **/
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});
