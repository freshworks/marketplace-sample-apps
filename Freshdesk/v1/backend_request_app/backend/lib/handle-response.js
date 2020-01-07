// Simple library to handle the response of an API request

function handleResponse(err, resp) {
  if (!err && resp.statusCode === 200) {
    console.log(JSON.stringify({
      status: resp.statusCode,
      message: 'success',
    }));
  }
}

exports = {
  handleResponse: handleResponse
};
