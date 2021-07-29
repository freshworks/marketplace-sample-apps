"use strict";

const expect = require("chai").expect;
const appInstallArg = require("./args/onAppInstall.json");
const appUninstallArg = require("./args/onAppUninstall.json");
const externalEventArg = require("./args/onExternalEvent.json");

describe("App Events Spec", function () {
  it("checks onAppInstall Success Flow", function () {
    const stubbedGenerate = this.stub("generateTargetUrl").resolves(
      "http://randomurl.com/webhook"
    );

    const stubbedRequest = this.stub("$request", "post").resolves({
      response: {
        url: "http://randomurl.com/webhook",
      },
    });

    const stubbedDB = this.stub("$db", "set").callsFake(function (key, value) {
      expect(key).to.equal("githubWebhookId");
      expect(value.url).to.equal("http://randomurl.com/webhook");
      stubbedRequest.restore();
      stubbedDB.restore();
      stubbedGenerate.restore();
      return Promise.resolve();
    });
    return this.invoke("onAppInstall", appInstallArg);
  });

  it("checks onAppInstall request Flow", function () {
    const stubbedRequest = this.stub("$request", "post").rejects({
      error: "failed to make post request",
    });

    this.invoke("onAppInstall", appInstallArg);
    stubbedRequest.restore();
  });

  it("checks onAppInstalDB faill", function () {
    const stubbedRequest = this.stub("$request", "post").resolves({
      response: {
        url: "http://randomurl.com/webhook",
      },
    });
    const stubbedDB = this.stub("$db", "set").callsFake(function () {
      stubbedRequest.restore();
      stubbedDB.restore();
      return Promise.reject();
    });

    this.invoke("onAppInstall", appInstallArg);
  });

  it("checks if generateTargetURL can be set", function () {
    const stubbedGenerate = this.stub("generateTargetUrl").resolves(
      "http://randomurl.com/webhook"
    );

    const StubbedRequest = this.stub("$request", "post").callsFake(function (
      url,
      payload
    ) {
      expect(payload.json.config.url).to.equal("http://randomurl.com/webhook");
      StubbedRequest.restore();
      stubbedGenerate.restore();
    });

    this.invoke("onAppInstall", appInstallArg);
  });

  it("rejects generateTargetUrl", function () {
    const stubbedGenerate = this.stub("generateTargetUrl").rejects({
      error: "unable to generate target url",
    });

    this.invoke("onAppInstall", appInstallArg);
    stubbedGenerate.restore();
  });

  it("handles app uninstall", function () {
    const stubbedDB = this.stub("$db", "get").resolves({
      url: "http://randomurl.com/webhook",
    });
    const StubbedRequest = this.stub("$request", "delete").callsFake(function (
      data
    ) {
      console.log("data", data);
      StubbedRequest.restore();
      stubbedDB.restore();
      return Promise.resolve();
    });

    this.invoke("onAppUninstall", appUninstallArg);
  });

  it("handles App Uninstall events db failure", function () {
    const stubbedDB = this.stub("$db", "get").rejects("Db call rejected");
    this.invoke("onAppUninstall", appUninstallArg);
    stubbedDB.restore();
  });

  it("handles App Uninstall events request failure", function () {
    const stubbedDB = this.stub("$db", "get").resolves({
      url: "http://randomurl.com/webhook",
    });
    const StubbedRequest = this.stub("$request", "delete").rejects(
      "request call rejected"
    );

    this.invoke("onAppUninstall", appUninstallArg);

    stubbedDB.restore();
    StubbedRequest.restore();
  });

  it("handles external events", function () {
    const stubbedDB = this.stub("$db", "get").resolves({
      issue_data: {
        ticketID: 1,
      },
    });
    const StubbedRequest = this.stub("$request", "post").callsFake(function (
      data
    ) {
      console.log("data", data);
      StubbedRequest.restore();
      stubbedDB.restore();
      return Promise.resolve();
    });
    this.invoke("onExternalEvent", externalEventArg);
  });

  it("handles external event db reject", function () {
    const stubbedDB = this.stub("$db", "get").rejects({
      error: "Db call rejected",
    });
    this.invoke("onExternalEvent", externalEventArg);
    stubbedDB.restore();
  });

  it("handles external event request call reject", function () {
    const stubbedDB = this.stub("$db", "get").resolves({
      issue_data: {
        ticketID: 1,
      },
    });
    const StubbedRequest = this.stub("$request", "delete").rejects(
      "request call rejected"
    );
    this.invoke("onExternalEvent", externalEventArg);
    stubbedDB.restore();
    StubbedRequest.restore();
  });
});
