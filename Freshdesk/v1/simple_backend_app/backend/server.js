
var request = loadDependency('request');
var requestData = loadLib('req-data');

var sentimentUrl = 'http://text-processing.com/api/sentiment/';

// getting the sentiment result.
function doSentimentAnalysis(noteDesc, callback) {
  request.post({
    url: sentimentUrl,
    formData: {
      text: noteDesc
    }
  }, function(err, resp, body) {
    if (err) { return callback(err); }
    if (resp.statusCode == 200) {
      callback(null, body);
    } else {
      callback({
        status: resp.statusCode,
        message: body
      });
    }
  });
}

// sms the sentiment result.
function sendReport(data, args) {
  data = JSON.parse(data);
  var iparams = args.iparams;
  var ticketId = args.data.conversation.ticket_id;
  var message = 'A new note has been created for ticket. '+iparams.domain+'/helpdesk/tickets/'+ticketId+'. ';
  message += 'Sentiment Result: ' + data.label;
  var options = {
    message: message,
    iparams: iparams
  };
  var reqData = requestData(options);
  // sending the message to the agent using the request npm.
  request(reqData, function(err, resp, body) {
    if(err) {return console.log(err);}
    if (resp.statusCode == 201) {
      console.log(body);
    } else {
      var err = {
        status: resp.statusCode, 
        message: body
      };
      console.log(err);
    }
  });
}

exports = {

  events: [
    { event: 'onConversationCreate', callback: 'processConversation' }
  ],

  processConversation: function(args) {
    var noteDesc = args.data.conversation.body_text;
    doSentimentAnalysis(noteDesc, function(err, data) {
      if (err) { console.log(err); }
      console.log(data);
      sendReport(data, args);
    });
  }

};
