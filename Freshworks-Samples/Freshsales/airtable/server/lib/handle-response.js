function handleResponse(err, resp) {
  if (!err && resp.statusCode === 200) {
    console.log(JSON.stringify({
      status: resp.statusCode,
      message: 'success'
    }));
  }
}

exports = {
  handleResponse: handleResponse
};