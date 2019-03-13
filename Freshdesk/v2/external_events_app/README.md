## External Events App

  This app creates an outbound email ticket in Freshdesk every time an issue of type “bug” is created in JIRA. The requester of the ticket will be the person who created the bug in JIRA

  This app demonstrates the following features
  1. Using App Setup events to create and delete the JIRA webhoook
  2. Responding to the JIRA webhook using external events
  3. Making an API request in server.js

### Prerequisites:

1. It is mandatory to have a Atlassian JIRA account (free trial available).
2. The app needs the Atlassian JIRA domain, username, and password to create and delete the webhook.
