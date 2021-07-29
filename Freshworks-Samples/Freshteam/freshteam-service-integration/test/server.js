"use strict";

const expect = require("chai").expect;
const onEmployeeCreateArg = require(`../server/test_data/onEmployeeCreate.json`);

describe("App Events Spec", function () {
  it.only("Checks app success workflow", function () {
    const stubbedRequest = this.stub("$request", "post").callsFake(
      (url, payload) => {
        stubbedRequest.restore();
        return Promise.resolve();
      }
    );

    this.invoke("onEmployeeCreate", onEmployeeCreateArg);
  });
  it("checks app failure case", function () {
    const stubbedRequest = this.stub("$request", "post").rejects({
      response: {
        url: "Unable to create ticket",
      },
    });
    this.invoke("onEmployeeCreate", onEmployeeCreateArg);
    stubbedRequest.restore();
  });
});
