## Freshdesk sample apps (v2)
This repository contains sample apps demonstrating the various features available in the v2 App Framework. It contains the following apps:

### [Serverless Request App](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshdesk/v2/serverless_request_app)

Every time a new ticket is created, this app makes an API request to HTTPbin.org and prints the response to the terminal window.

This app demonstrates the following features

1. Freshdesk Product event - onTicketCreate
2. Making an API GET request using the npm request module
3. Handing the response of a API request using a internal library

### [External Events App](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshdesk/v2/external_events_app)
  
  This app creates an outbound email ticket in Freshdesk every time an issue of type “bug” is created in JIRA. The requester of the ticket will be the person who created the bug in JIRA

  This app demonstrates the following features
  1. Using App Setup events to create and delete the JIRA webhoook
  2. Responding to the JIRA webhook using external events
  3. Making an API request in server.js

### [Ticket Merger](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshdesk/v2/ticket_merger)

Merges Tickets created by the same requester within a configurable time window. Also adds useful notes on the tickets mentioning the ticket to/from which the merge was done. Requires the Freshdesk API key to make the necessary API calls to add notes, close tickets etc.

This app demonstrates the following features,

1. Freshdesk Product event - onTicketCreate
2. Making an API calls to Freshdesk using proper Authentication and Authorization.
3. Data Persistence to keep track of ticket create events.

### [Your First App](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshdesk/v2/your_first_app)

This app shows the Freshdesk logo and the name of the ticket requester.

This app demonstrates the following features

1. Using data API to get the ticket requester's details
2. Loading an image from the app folder

### [Your First Serverless App](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshdesk/v2/your_first_serverless_app)

Every time a new ticket is created, this app prints a "Hello {requester name}" message to the terminal window.

This app demonstrates the following features

1. Product event - onTicketCreate
2. Accessing data from the event payload
