'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

chai.use(chaiAsPromised);

describe('Server tests', function() {

  describe('#onTicketCreate', function() {

    before(function() {
      this.stubbedRequest = this.stub('$request', 'post');
      this.stubbedDB = this.stub('$db', 'set');
    });

    afterEach(function() {
      this.stubbedRequest.reset();
      this.stubbedDB.reset();
    });

    it('should set status in DB for a successful request', async function() {
      this.stubbedRequest.resolves();

      await this.invoke('onTicketCreate', {
        data: {
          ticket: {
            id: 1,
            subject: 'Hello World'
          }
        }
      });

      expect(this.stubbedDB.calledWith('1_status', {status: true})).to.eql(true);
    });

    it('should set status in DB for a failed request', async function() {
      this.stubbedRequest.rejects();

      await this.invoke('onTicketCreate', {
        data: {
          ticket: {
            id: 1,
            subject: 'Hello World'
          }
        }
      });

      expect(this.stubbedDB.calledWith('1_status', {status: false})).to.eql(true);
    });
  });

  describe('#createUser', function() {
    it('should succeed with name', async function() {
      const data = await this.invoke('createUser', {
        name: 'rachel'
      });

      expect(data.response).to.eql({ id: 123 });
    });

    it('should fail without name', function() {
      return chai.expect(this.invoke('createUser', {})).to.be.eventually.rejected;
    });
  });
});
