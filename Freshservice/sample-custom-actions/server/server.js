'use strict';

const request = require('request');

exports = {

  inviteUser : function(args) {
    const options = {
      url : `https://api.github.com/orgs/${args.iparams.organisation}/memberships/${args.actionparams.user_github_handle}`,
      headers : {
        Authorization : `Bearer ${args.iparams.gitAdminKey}`,
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      data: {
        'role': args.actionparams.user_role || 'member'
      }
    };

    request(options, function(error, response) {
      if(!error && response.statusCode === 200) {
        renderData(null, {'success': true, 'data': response.body});
      }

      renderData(null,{'success': false, 'error': 'Error while sending request to user'});
    });
  },

  deleteUser: function(args) {
    const options = {
      url : `https://api.github.com/orgs/${args.iparams.organisation}/memberships/${args.actionparams.user_github_handle}`,
      headers : {
        Authorization : `Bearer ${args.iparams.gitAdminKey}`,
        'Content-Type': 'application/json'
      },
      method: 'DELETE'
    };

    request(options, function(error, response) {
      if(!error && response.statusCode === 204) {
        renderData(null, {'success': true, 'data': response});
      }

      renderData(null,{'success': false, 'error': response.body});
    });
  }
};
