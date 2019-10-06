## External Events App

  This app creates a ticket in Freshdesk every time an issue created for the configured repository in GitHub.

  This app demonstrates the following generic features
  1. Using App Setup events to create and delete the GitHub webhoook
  2. Making an API request in server.js

  And the following platform features
  1. [External Events](https://developer.freshdesk.com/v2/docs/external-events/)
  2. [OAuth](https://developer.freshdesk.com/v2/docs/oauth/)
  3. [Secure installation parameter](https://developer.freshdesk.com/v2/docs/installation-parameters/)
  4. [Request API](https://developer.freshdesk.com/v2/docs/request-api/)
  5. [Data Storage](https://developer.freshdesk.com/v2/docs/data-storage/)


### Prerequisites:

1. It is mandatory to have a GitHub account.
2. The app needs the GitHub username, to authenticate the app to create and delete the webhook over REST API.
3. The ngrok application installed in the local machine to expose localhost to the internet

### Links:

* Create an OAuth App - [Link](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/)
* Register GitHub webhook - [Link](https://developer.github.com/webhooks/creating/)
