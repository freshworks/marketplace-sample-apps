"use strict";

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;

chai.use(chaiAsPromised);

const onContactCreateArgs = require("../server/test_data/onContactCreate.json");
const onContactUpdateArgs = require("../server/test_data/onContactUpdate.json");
const onContactDeleteArgs = require("../server/test_data/onContactDelete.json");

describe("Product events tests", function () {
  describe("onContactCreate event", function () {
    let stubbedDb;
    let stubbedGetRequest;
    let stubbedUpdateDb;
    let stubbedPostRequest;

    beforeEach(function () {
      stubbedDb = this.stub("$db", "get");
      stubbedUpdateDb = this.stub("$db", "update");
      stubbedGetRequest = this.stub("$request", "get");
      stubbedPostRequest = this.stub("$request", "post");
    });

    afterEach(function () {
      stubbedDb.restore();
      stubbedUpdateDb.restore();
      stubbedGetRequest.restore();
      stubbedPostRequest.restore();
    });

    it("checks when a contact already exists in the db", async function () {
      await this.invoke("onContactCreate", onContactCreateArgs);

      expect(
        stubbedDb.calledWith("contact:" + onContactCreateArgs.data.contact.id)
      ).to.eql(true);
    });

    it("checks when a contact 1. does not exist in the db and 2. fetches from API and 3. store mapping in db successfully", async function () {
      const FRESHDESK_CONTACT_ID = 123;

      stubbedDb.resolves({});
      stubbedGetRequest.resolves({
        response: '{"results":[{"id":' + FRESHDESK_CONTACT_ID + "}]}",
      });

      await this.invoke("onContactCreate", onContactCreateArgs);

      expect(
        stubbedGetRequest.calledWith(
          `https://ravirajsubramanian.freshdesk.com/api/v2/search/contacts?query="email:'${onContactCreateArgs.data.contact.email}'"`,
          {
            headers: {
              Authorization: "Basic <%= encode(iparam.freshdesk_api_key)%>",
            },
          }
        )
      ).to.eql(true);
      expect(
        stubbedUpdateDb.calledWith(
          "contact:" + onContactCreateArgs.data.contact.id,
          "set",
          { freshdesk_contact_id: FRESHDESK_CONTACT_ID }
        )
      ).to.eql(true);
    });

    it("checks failure of storing contact mapping", async function () {
      const FRESHDESK_CONTACT_ID = 123;

      stubbedDb.resolves();
      stubbedGetRequest.resolves({
        response: '{"results":[{"id":' + FRESHDESK_CONTACT_ID + "}]}",
      });
      stubbedUpdateDb.rejects();

      await this.invoke("onContactCreate", onContactCreateArgs);

      expect(
        stubbedGetRequest.calledWith(
          `https://ravirajsubramanian.freshdesk.com/api/v2/search/contacts?query="email:'${onContactCreateArgs.data.contact.email}'"`,
          {
            headers: {
              Authorization: "Basic <%= encode(iparam.freshdesk_api_key)%>",
            },
          }
        )
      ).to.eql(true);
      expect(
        stubbedUpdateDb.calledWith(
          "contact:" + onContactCreateArgs.data.contact.id,
          "set",
          { freshdesk_contact_id: FRESHDESK_CONTACT_ID }
        )
      ).to.eql(true);
    });

    it("checks when a contact does not exist and creates new contact in FD successfully", async function () {
      stubbedDb.rejects();
      stubbedGetRequest.resolves({ response: { results: [] } });
      stubbedPostRequest.resolves();

      await this.invoke("onContactCreate", onContactCreateArgs);

      expect(
        stubbedPostRequest.calledWith(
          "https://ravirajsubramanian.freshdesk.com/api/v2/contacts/",
          {
            headers: {
              Authorization: "Basic <%= encode(iparam.freshdesk_api_key)%>",
            },
            json: {
              email: onContactCreateArgs.data.contact.email,
              address: onContactCreateArgs.data.contact.address,
              avatar: onContactCreateArgs.data.contact.avatar,
              job_title: onContactCreateArgs.data.contact.job_title,
              time_zone: onContactCreateArgs.data.contact.time_zone,
              mobile: onContactCreateArgs.data.contact.mobile_number,
              phone: onContactCreateArgs.data.contact.work_number,
              name:
                onContactCreateArgs.data.contact.first_name +
                " " +
                onContactCreateArgs.data.contact.last_name,
              twitter_id: onContactCreateArgs.data.contact.twitter.split(
                "https://twitter.com/"
              )[1],
            },
          }
        )
      ).to.eql(true);
    });

    it("checks failure of Freshdesk contact creation", async function () {
      stubbedDb.rejects({});
      stubbedGetRequest.resolves({ response: { results: [] } });
      stubbedPostRequest.rejects();

      await this.invoke("onContactCreate", onContactCreateArgs);

      expect(
        stubbedPostRequest.calledWith(
          "https://ravirajsubramanian.freshdesk.com/api/v2/contacts/",
          {
            headers: {
              Authorization: "Basic <%= encode(iparam.freshdesk_api_key)%>",
            },
            json: {
              email: onContactCreateArgs.data.contact.email,
              address: onContactCreateArgs.data.contact.address,
              avatar: onContactCreateArgs.data.contact.avatar,
              job_title: onContactCreateArgs.data.contact.job_title,
              time_zone: onContactCreateArgs.data.contact.time_zone,
              mobile: onContactCreateArgs.data.contact.mobile_number,
              phone: onContactCreateArgs.data.contact.work_number,
              name:
                onContactCreateArgs.data.contact.first_name +
                " " +
                onContactCreateArgs.data.contact.last_name,
              twitter_id: onContactCreateArgs.data.contact.twitter.split(
                "https://twitter.com/"
              )[1],
            },
          }
        )
      ).to.eql(true);
    });
  });

  describe("onContactUpdate event", function () {
    let stubbedDb;
    let stubbedPutRequest;

    beforeEach(function () {
      stubbedDb = this.stub("$db", "get");
      stubbedPutRequest = this.stub("$request", "put");
    });

    afterEach(function () {
      stubbedDb.restore();
      stubbedPutRequest.restore();
    });

    it("checks when a contact already exists in the db", async function () {
      const FRESHDESK_CONTACT_ID = 123;

      stubbedDb.resolves({
        freshdesk_contact_id: FRESHDESK_CONTACT_ID,
      });
      stubbedPutRequest.resolves();

      await this.invoke("onContactUpdate", onContactUpdateArgs);

      expect(
        stubbedPutRequest.calledWith(
          `https://ravirajsubramanian.freshdesk.com/api/v2/contacts/${FRESHDESK_CONTACT_ID}`,
          {
            headers: {
              Authorization: "Basic <%= encode(iparam.freshdesk_api_key)%>",
            },
            json: {
              address: "Global infocity",
              avatar: null,
              job_title: "Asst. Manager",
              mobile: "3333333333",
              time_zone: "Mexico City",
              phone: "2222222222",
              twitter_id: "raviraj",
              name: "Tony Stark",
            },
          }
        )
      ).to.eql(true);
    });

    it("checks update contact failure", async function () {
      const FRESHDESK_CONTACT_ID = 123;

      stubbedDb.resolves({
        freshdesk_contact_id: FRESHDESK_CONTACT_ID,
      });
      stubbedPutRequest.rejects();

      await this.invoke("onContactUpdate", onContactUpdateArgs);

      expect(
        stubbedPutRequest.calledWith(
          `https://ravirajsubramanian.freshdesk.com/api/v2/contacts/${FRESHDESK_CONTACT_ID}`,
          {
            headers: {
              Authorization: "Basic <%= encode(iparam.freshdesk_api_key)%>",
            },
            json: {
              address: "Global infocity",
              avatar: null,
              job_title: "Asst. Manager",
              mobile: "3333333333",
              time_zone: "Mexico City",
              phone: "2222222222",
              twitter_id: "raviraj",
              name: "Tony Stark",
            },
          }
        )
      ).to.eql(true);
    });

    it("checks empty first_name in the updated attributes changes", async function () {
      const FRESHDESK_CONTACT_ID = 123;

      stubbedDb.resolves({
        freshdesk_contact_id: FRESHDESK_CONTACT_ID,
      });

      stubbedPutRequest.resolves();

      await this.invoke("onContactUpdate", {
        data: {
          contact: {
            id: 24,
            first_name: "Jane",
            last_name: "Sampleton",
            changes: {
              job_title: ["Manager", "Asst. Manager"],
              first_name: ["Jane", ""],
            },
          },
        },
      });

      expect(
        stubbedPutRequest.calledWith(
          `https://ravirajsubramanian.freshdesk.com/api/v2/contacts/${FRESHDESK_CONTACT_ID}`,
          {
            headers: {
              Authorization: "Basic <%= encode(iparam.freshdesk_api_key)%>",
            },
            json: {
              job_title: "Asst. Manager",
              name: "Jane Sampleton",
            },
          }
        )
      ).to.eql(true);
    });

    it("checks empty last_name in the updated attributes changes", async function () {
      const FRESHDESK_CONTACT_ID = 123;

      stubbedDb.resolves({
        freshdesk_contact_id: FRESHDESK_CONTACT_ID,
      });

      stubbedPutRequest.resolves();

      await this.invoke("onContactUpdate", {
        data: {
          contact: {
            id: 24,
            first_name: "Jane",
            last_name: "Sampleton",
            changes: {
              job_title: ["Manager", "Asst. Manager"],
              last_name: ["Sampleton", ""],
            },
          },
        },
      });

      expect(
        stubbedPutRequest.calledWith(
          `https://ravirajsubramanian.freshdesk.com/api/v2/contacts/${FRESHDESK_CONTACT_ID}`,
          {
            headers: {
              Authorization: "Basic <%= encode(iparam.freshdesk_api_key)%>",
            },
            json: {
              job_title: "Asst. Manager",
              name: "Jane Sampleton",
            },
          }
        )
      ).to.eql(true);
    });

    it("checks no changes in the attributes", async function () {
      stubbedDb.resolves({
        freshdesk_contact_id: 123,
      });

      await this.invoke("onContactUpdate", {
        data: { contact: { id: 24, changes: {} } },
      });

      expect(
        stubbedDb.calledWith("contact:" + onContactUpdateArgs.data.contact.id)
      ).to.eql(true);
    });
  });

  describe("onContactDelete event", function () {
    let stubbedDb;
    let stubbedDbDelete;
    let stubbedDeleteRequest;

    beforeEach(function () {
      stubbedDb = this.stub("$db", "get");
      stubbedDbDelete = this.stub("$db", "delete");
      stubbedDeleteRequest = this.stub("$request", "delete");
    });

    afterEach(function () {
      stubbedDb.restore();
      stubbedDbDelete.restore();
      stubbedDeleteRequest.restore();
    });

    it("checks when a contact already exists in the db", async function () {
      const FRESHDESK_CONTACT_ID = 123;

      stubbedDb.resolves({
        freshdesk_contact_id: FRESHDESK_CONTACT_ID,
      });

      stubbedDeleteRequest.resolves();
      stubbedDbDelete.resolves();

      await this.invoke("onContactDelete", onContactDeleteArgs);

      expect(
        stubbedDb.calledWith("contact:" + onContactUpdateArgs.data.contact.id)
      ).to.eql(true);
      expect(
        stubbedDeleteRequest.calledWith(
          `https://ravirajsubramanian.freshdesk.com/api/v2/contacts/${FRESHDESK_CONTACT_ID}`,
          {
            headers: {
              Authorization: "Basic <%= encode(iparam.freshdesk_api_key)%>",
            },
          }
        )
      ).to.eql(true);
      expect(
        stubbedDbDelete.calledWith(
          `contact:${onContactDeleteArgs.data.contact.id}`
        )
      ).to.eql(true);
    });

    it("checks contact delete failure", async function () {
      const FRESHDESK_CONTACT_ID = 123;

      stubbedDb.resolves({
        freshdesk_contact_id: FRESHDESK_CONTACT_ID,
      });

      stubbedDeleteRequest.resolves({});
      stubbedDbDelete.rejects();

      await this.invoke("onContactDelete", onContactDeleteArgs);

      expect(
        stubbedDb.calledWith("contact:" + onContactUpdateArgs.data.contact.id)
      ).to.eql(true);
      expect(
        stubbedDeleteRequest.calledWith(
          `https://ravirajsubramanian.freshdesk.com/api/v2/contacts/${FRESHDESK_CONTACT_ID}`,
          {
            headers: {
              Authorization: "Basic <%= encode(iparam.freshdesk_api_key)%>",
            },
          }
        )
      ).to.eql(true);
      expect(
        stubbedDbDelete.calledWith(
          `contact:${onContactDeleteArgs.data.contact.id}`
        )
      ).to.eql(true);
    });

    it("checks request delete failure", async function () {
      const FRESHDESK_CONTACT_ID = 123;

      stubbedDb.resolves({
        freshdesk_contact_id: FRESHDESK_CONTACT_ID,
      });

      stubbedDeleteRequest.rejects();

      await this.invoke("onContactDelete", onContactDeleteArgs);

      expect(
        stubbedDb.calledWith("contact:" + onContactUpdateArgs.data.contact.id)
      ).to.eql(true);
      expect(
        stubbedDeleteRequest.calledWith(
          `https://ravirajsubramanian.freshdesk.com/api/v2/contacts/${FRESHDESK_CONTACT_ID}`,
          {
            headers: {
              Authorization: "Basic <%= encode(iparam.freshdesk_api_key)%>",
            },
          }
        )
      ).to.eql(true);
    });

    it("checks failure of getting contact from db", async function () {
      stubbedDb.rejects();

      await this.invoke("onContactDelete", onContactDeleteArgs);

      expect(
        stubbedDb.calledWith("contact:" + onContactUpdateArgs.data.contact.id)
      ).to.eql(true);
    });
  });
});
