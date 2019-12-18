'use strict';

const expect = require('chai').expect;

describe('App Events Spec', function() {
  it('registers hooks with github', function() {
    const stubbedRequest = this.stub('$request', 'post').resolves({
      response: {
        url: 'fakeURL'
      }
    });

    const stubbedDB = this.stub('$db', 'set').callsFake(async function(key, value) {
      expect(key).to.equal('githubWebhookId');
      expect(value.url).to.equal('fakeURL');

      stubbedRequest.restore();
      stubbedDB.restore();

      return;
    });

    return this.invoke('onAppInstall', {
      iparams: {
        github_username: 'hello',
        github_repo_name: 'hello'
      }
    });
  });

  it('handles failure when registering hooks with github', function() {
    const stubbedRequest = this.stub('$request', 'post').rejects({
      message: 'Something went wrong'
    });

    return this.invoke('onAppInstall', {
      iparams: {
        github_username: 'hello',
        github_repo_name: 'hello'
      }
    }).then(response => {
      expect(response.message.message).to.equal('Something went wrong');
    });
  });

  it('handles target url failure', async function() {
    const stubbedGenerate = this.stub('generateTargetUrl').rejects({
      error: 'something went wrong'
    });

    const response = await this.invoke('onAppInstall', {
      iparams: {
        github_username: 'hello',
        github_repo_name: 'hello'
      }
    })

    expect(response.message).to.equal('The webhook registration failed');

    stubbedGenerate.restore();
  });
});
