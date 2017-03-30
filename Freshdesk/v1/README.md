## Freshdesk sample apps (v1)
This repository contains sample apps demonstrating the various features available in the v1 App Framework. It contains the follwing apps:

### [Google Hangouts](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshdesk/v1/google_hangouts)

  Allows you to chat with your customers on Google Hangouts without leaving your helpdesk.

  This app demonstrates the following features
  1. Using domHelper to get requester info

### [In App Events App](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshdesk/v1/in_app_events_app)

  This app demonstrates the in app events feature.

  This app demonstrates the following features
  1. In app change event
  2. In app click event

### [My First App](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshdesk/v1/my_first_app)

  This app shows the Freshdesk logo and the name of the ticket requester or contact.

  This app demonstrates the following features
  1. Using domHelper to get requester and contact details
  2. Loading an image from the assets folder

### [Simple Backend App](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshdesk/v1/simple_backend_app)

  Every time a new reply or note is added to a ticket, this app makes a request to http://text-processing.com which does a sentiment analysis and then the app sends the result of the analysis as an SMS to the agent.

  This app demonstrates the following features
  1. Backend event - onConversationCreate
  2. Making an API request in server.js
  3. Using an npm library (request)

### [Simple Data Storage App](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshdesk/v1/simple_datastorage_app)

  This app allows you to save a memo linked to the ticket or contact.

  This app demonstrates the following features
  1. Data Storage - set, get & delete

### [Simple OAuth App](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshdesk/v1/simple_oauth_app)

  This apps lists the files and folders available in your OneDrive account.

  This app demonstrates the following features
  1. OAuth 2.0 - account level OAuth
  2. Request API - making an OAuth request with access_token

### [Simple Request App](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshdesk/v1/simple_request_app)

  This apps makes REST API calls to httpbin.org.

  This app demonstrates the following features
  1. Request API - GET, POST, PUT & DELETE

### [Simple Server Method Invocation App](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshdesk/v1/simple_server_method_invocation_app)

 This app enables an agent to send a message (entered by the agent) as an SMS.

  This app demonstrates the following features
  1. Server method invocation i.e the front end component (app.js) of the app calling a backend method (server.js)
  2. Making an API request in server.js
  3. Using an npm library (request)
