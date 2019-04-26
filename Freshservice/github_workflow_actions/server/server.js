'use strict'

exports = {

  inviteUser: function (args) {
    const url = `https://api.github.com/orgs/${args.iparams.github_organization}/memberships/${args.user_github_handle}`
    const options = {
      headers: {
        Authorization: `Bearer ${args.iparams.github_api_key}`,
        'User-Agent': 'Awesome-Octocat-App', // This is required by the GitHub API
        'Content-Type': 'application/json'
      },
      // sending the request body as value in json key will automatically append the request type header
      json: { role: args.user_role || 'member' }
    }
    $request.put(url, options)
      .then(
        data => { renderData(null, { success: true, data: data.response }) },
        error => {
          console.log('Failed to invite the user to the GitHub organization.', error.response.message)
          renderData(null, { success: false, error: 'Failed to invite the user to the GitHub organization' })
        }
      )
  },

  deleteUser: function (args) {
    const url = `https://api.github.com/orgs/${args.iparams.github_organization}/memberships/${args.user_github_handle}`
    const options = {
      headers: {
        Authorization: `Bearer ${args.iparams.github_api_key}`,
        'User-Agent': 'Awesome-Octocat-App',
        'Content-Type': 'application/json'
      }
    }
    $request.delete(url, options)
      .then(
        data => { renderData(null, { success: true, data: data }) },
        error => {
          console.log('Failed to delete the user from the GitHub organization.', error.response.message)
          renderData(null, { success: false, error: 'Failed to delete the user from the GitHub organization' })
        }
      )
  }
}
