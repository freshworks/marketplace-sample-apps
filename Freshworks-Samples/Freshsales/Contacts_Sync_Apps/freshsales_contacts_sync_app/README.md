## Freshsales contacts sync App

This app automatically updates the relevant contact's details in Freshsales over an API request whenever a contact is updated in Freshdesk.

This app demonstrates the following features,

1. External Events - onContactUpdate
2. Data storage to store the contact id mapping between Freshdesk and Freshsales - $db
3. Request API in Serverless app - $request
4. Secure installation parameter (iparam) - to get the Freshsales API key to update the contact details
