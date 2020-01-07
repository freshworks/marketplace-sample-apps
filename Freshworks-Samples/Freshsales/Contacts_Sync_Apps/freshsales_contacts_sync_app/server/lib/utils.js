'use strict';

exports = {
  isEmpty: obj => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  },
  makeGetRequest: async options => {
    try {
      return $request.get(options.url, { headers: options.headers });
    } catch (error) {
      console.log('failed to make get request with options:', options);
      console.log(JSON.stringify(error));
      throw error;
    }
  },
  makePutRequest: async options => {
    try {
      return $request.put(options.url, { headers: options.headers, json: options.body });
    } catch (error) {
      console.log('failed to make put request with options:', options);
      console.log(JSON.stringify(error));
      throw error;
    }
  },
  makeDeleteRequest: async options => {
    try {
      return $request.delete(options.url, { headers: options.headers });
    } catch (error) {
      console.log('failed to make delete request with options:', options);
      console.log(JSON.stringify(error));
      throw error;
    }
  },
  makePostRequest: async options => {
    try {
      return $request.post(options.url, { headers: options.headers, json: options.body });
    } catch (error) {
      console.log('failed to make post request with options:', options);
      console.log(JSON.stringify(error));
      throw error;
    }
  }
};
