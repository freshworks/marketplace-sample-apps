## Asana Serverless OAuth App

This app creates a task in Asana for every ticket created in Freshdesk.

This app demonstrates the following features

1. [OAuth 2.0 - account level OAuth](https://developer.freshdesk.com/v2/docs/oauth/)
2. Making an API request through [Request API](https://developer.freshdesk.com/v2/docs/request-api/) using oauth tokens to authenticate
3. [Freshdesk Product event - onTicketCreate](https://developer.freshdesk.com/v2/docs/product-events/#onticketcreate)
4. Using a [custom installation page](https://developer.freshdesk.com/v2/docs/custom-installation-page/) to dynamically populate dependent fields (workspace, project)

### Prerequisites:

1. It is mandatory to have a Asana account.
2. You must have an OAuth app registered in Asana - https://asana.com/developers/documentation/getting-started/auth#register-an-app
