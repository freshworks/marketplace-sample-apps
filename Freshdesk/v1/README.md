## Freshdesk sample apps (v1)
This repository contains sample apps demonstrating the various features available in the v1 App Framework. It contains the follwing apps:

### Simple Backend App

Every time a new reply or note is added to a ticket, this app makes a request to http://text-processing.com which does a sentiment analysis and then the app sends the result of the analysis as an SMS to the agent.

  This app demonstrates the following features
  1. Backend event - onConversationCreate
  2. Making an API request in server.js
  3. Using an npm library (request)


### Simple Server Method Invocation App:

 This app enables an agent to send a message (entered by the agent) as an SMS.

  This app demonstrates the following features
  1. Server method invocation i.e the front end component (app.js) of the app calling a backend method (server.js)
  2. Making an API request in server.js
  3. Using an npm library (request)
