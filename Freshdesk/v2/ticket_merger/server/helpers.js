var needle = loadDependency('needle');

needle.defaults({
  json: true,
  timeout: 5000,
  'read_timeout': 5000,
  auth: 'basic',
  password: 'X'
});

var SUCCESS_CODES = [ 200, 201, 204 ];

function saveTicket(requesterID, ticket) {
  $db.set(requesterID.toString(), {
    id: ticket.id,
    created_at: ticket.created_at
  }).done(inspect).fail(inspect);
}

function callAPI(options, callback) {
  options.url = options.url.startsWith('https://') ? options.url : 'https://' + options.url;

  return needle.request(options.method, options.url, options.body, {
    username: options.apiKey,
    'content_type': 'application/json',
    multipart: !!options.multipart
  }, function(error, response, body) {
    if (response && SUCCESS_CODES.indexOf(response.statusCode) === -1) {
      return callback(`API call failed with status code: ${response.statusCode} and body: ${inspect(body)}`);
    }

    return callback.apply(null, Array.prototype.slice(arguments));
  });
}

function diffTime(a, b) {
  return new Date(a) - new Date(b);
}

function withInWindow(primary, secondary, windowDuration) {
  return diffTime(secondary.created_at, primary.created_at) < windowDuration * 60 * 1000;
}

function generateSecondaryNote(primaryTicket) {
  return `This ticket is closed and merged into ticket <a href="${primaryTicket.id}">${primaryTicket.id}</a> by the TicketMerger App!`;
}

function generatePrimaryNote(secondaryTicket) {
  return `Merged from ticket <a href="${secondaryTicket.id}">${secondaryTicket.id}</a> by the TicketMerger App!<br /><br /><b>Subject: </b>${secondaryTicket.subject}<br /><br /><b>Description: </b>${secondaryTicket.description}`;
}

/**
 *  Bare minimum async.forEachSeries. Nothing fancy.
 */
function forEachSeries(array, action, finalCallback) {
  var i = -1,
      length = array.length,
      next = function(error) {
        if (error) {
          return finalCallback(error);
        }

        if(++i === length) {
          return finalCallback();
        }

        return action(array[i], next);
      };

  next();
}

function inspect(object) {
  return JSON.stringify(object, function(k, v) {
    if (typeof v === 'undefined') {
      return '__UNDEFINED__';
    }

    return v;
  }, 2);
}

exports = {
  async: {
    forEachSeries: forEachSeries
  },
  callAPI: callAPI,
  inspect: inspect,
  diffTime: diffTime,
  saveTicket: saveTicket,
  withInWindow: withInWindow,
  generatePrimaryNote: generatePrimaryNote,
  generateSecondaryNote: generateSecondaryNote
};
