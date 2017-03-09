## Simple Backend App

  Every time a new reply or note is added to a ticket, this app makes a request to http://text-processing.com which does a sentiment analysis and then the app sends the result of the analysis as an SMS to the agent.

  This app demonstrates the following features
  1. Backend event - onConversationCreate
  2. Making an API request in server.js
  3. Using an npm library (request)


### Prerequisites:

1. It is mandatory to have a Twilio account.
2. The app needs the Twilio account_sid and auth_token to make the api call.
