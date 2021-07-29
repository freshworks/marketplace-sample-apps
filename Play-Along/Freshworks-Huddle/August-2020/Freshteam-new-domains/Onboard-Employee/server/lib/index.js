"use strict";

const got = require("got");

const request = async (url, options) => {
  const response = await got[options.method](url, options);

  return response;
};

exports = {
  request,
};
