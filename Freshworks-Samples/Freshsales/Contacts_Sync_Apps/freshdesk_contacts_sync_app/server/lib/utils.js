"use strict";

exports = {
  isEmpty: (obj) => {
    return !Object.keys(obj).length;
  },
  makeGetRequest: async (options) => {
    try {
      return await $request.get(options.url, { headers: options.headers });
    } catch (error) {
      console.log("failed to make get request with options:", options);
      console.log(JSON.stringify(error));
      throw error;
    }
  },
  makePutRequest: async (options) => {
    try {
      return await $request.put(options.url, {
        headers: options.headers,
        json: options.body,
      });
    } catch (error) {
      console.log("failed to make put request with options:", options);
      console.log(JSON.stringify(error));
      throw error;
    }
  },
  makeDeleteRequest: async (options) => {
    try {
      return await $request.delete(options.url, { headers: options.headers });
    } catch (error) {
      console.log("failed to make delete request with options:", options);
      console.log(JSON.stringify(error));
      throw error;
    }
  },
  makePostRequest: async (options) => {
    try {
      return await $request.post(options.url, {
        headers: options.headers,
        json: options.body,
      });
    } catch (error) {
      console.log("failed to make post request with options:", options);
      console.log(JSON.stringify(error));
      throw error;
    }
  },
};
