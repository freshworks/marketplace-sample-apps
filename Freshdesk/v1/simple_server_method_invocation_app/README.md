## Simple Server Method Invocation App:

  This app enables an agent to send a message (entered by the agent) as an SMS.

  This app demonstrates the following features
  1. Server method invocation i.e the front end component (app.js) of the app calling a backend method (server.js)
  2. Making an API request in server.js
  3. Using an NPM library (twilio)

### Prerequisites:

1. It is mandatory to have a Twillio account (free trial available).
2. The app needs the Twillio account_sid and auth_token to make the API call.
3. The app sends the SMS using the Twillio phone number. You can get this number at https://www.twilio.com/console/phone-numbers/getting-started once you have registered.