## Freshdesk sample apps (v2)
This repository contains sample apps demonstrating the various features available in the v2 App Framework. It contains the following apps:

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

### [Simple Data Storage App](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshdesk/v2/simple_datastorage_app)

This app allows you to save a memo linked to the ticket.

This app demonstrates the following features

1. Data Storage - set, get & delete

### [Simple Request App](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshdesk/v2/simple_request_app)

This apps makes REST API calls to httpbin.org.

This app demonstrates the following features

1. Request API - GET, POST, PUT & DELETE

### [Serverless Request App](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshdesk/v2/serverless_request_app)

Every time a new ticket is created, this app makes an API request to HTTPbin.org and prints the response to the terminal window.

This app demonstrates the following features

1. Freshdesk Product event - onTicketCreate
2. Making an API GET request using the npm request module
3. Handing the response of a API request using a internal library

### [Sample CRM App](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshdesk/v2/sample_crm_app)

Every time the ticket details page is loaded, this app makes an API call to the Freshsales CRM to retrieve additional information about the ticket requester.

This app demonstrates the following features

1. Using data API to get the ticket requester's details
2. Request API - GET request to retrieve the ticket requester’s details

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

### [OneDrive OAuth App](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshdesk/v2/onedrive_oauth_app)

  This apps lists the files and folders available in your OneDrive account.

  This app demonstrates the following features

  1. OAuth 2.0 - account level OAuth
  2. Request API - making an OAuth request with access_token

### [Twilio SMS](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshdesk/v2/twilio_sms)

  This app enables an agent to send a message (entered by the agent) as an SMS.

  This app demonstrates the following features

  1. Server method invocation i.e the front end component (app.js) of the app calling a serverless method (server.js)
  2. Making an API request in server.js
  3. Using an NPM library (twilio)

### [Ticket Background App](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshdesk/v2/ticket_background_app)

Every time the ticket details page is loaded, this app disables the ticket priority field.

This app demonstrates the following features

1. App location - ticket_background
2. Using Interface APIs to disable ticket properties.

### [Ticket Top Navigation App](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshdesk/v2/ticket_top_navigation_app)

This app adds a shortcut to start the timer in the top navigation of the ticket details page. On clicking the app icon, the Start Timer form will be shown.

This app demonstrates the following features

1. App location - ticket_top_navigation.
2. Using Interface APIs for opening a modal.
3. Using Request APIs for fetching agent list.
4. Using Instance APIs to send the message (Start timer inputs) from the modal to the app.
5. Using Interface APIs for starting the timer.

Note:
Interface APIs are not accessible in the Modal. So, the data has to be passed from the modal to the parent location which then starts the timer.

### [Intercepting Events App](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshdesk/v2/intercepting_events_app)

This app intercepts the ticket close event and checks if there is any timer running. If so, it rejects the close action and displays an error message.

This app demonstrates the following features

1. App location - ticket_background.
2. Using Data APIs for fetching ticket ID.
3. Using Request APIs for fetching time entries for the ticket.
4. Using Intercept events APIs to intercept the ticket close and properties update event.

### [Instance API App](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshdesk/v2/instance_api_app)

This app demonstrates the usage of modals and Instance APIs.

This app demonstrates the following features:

1. Using data API to get the ticket requester's details.
2. Using interface API to open up a modal and pass data to the modal.
3. Using instance API to retrieve the data received from the parent location.

### [Intercepting Events App 2](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshdesk/v2/intercepting_events_app_2)

Whenever a ticket is closed, this app checks if there are any tags attached to the ticket and if no tags are attached, stops the close event and displays an error notification.

This app demonstrates the following features:

1. Using data API to fetch the ticket's data.
2. Using intercept APIs to check and stop the close action if there are no tags attached to the ticket.

### [Simple Events Api App](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshdesk/v2/simple_events_api_app)

Whenever an agent clicks on the send reply button in the ticket details page, this app displays a success notification.

This app demonstrates the following:

1. App location - ticket_background.
2. Using events API to display success notification when the agent clicks on send reply button.
