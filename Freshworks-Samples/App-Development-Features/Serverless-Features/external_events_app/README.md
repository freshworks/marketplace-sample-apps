## External Events App

This app creates an outbound email ticket in Freshdesk every time an issue of type “bug” is created in JIRA. The requester of the ticket will be the person who created the bug in JIRA

This app demonstrates the following features

1. Using App Setup events to create and delete the JIRA webhoook
2. Responding to the JIRA webhook using external events
3. Making an API request in server.js

## Screenshots

![](screenshots/FDView.png)

![](screenshots/jiraView.png)

### Prerequisites:

1. It is mandatory to have a Atlassian JIRA account (free trial available).
2. The app needs the Atlassian JIRA domain, username, and password to create and delete the webhook.

# JIRA - External Events App

### Description:

This app creates an outbound email ticket in Freshdesk every time an issue of type “bug” is created in JIRA. The requester of the ticket will be the person who created the bug in JIRA

### Screenshots:

![](screenshots/FDView.png)

![](screenshots/jiraView.png)

### Features demonstrated:

1. Using App Setup events to create and delete the JIRA webhoook
2. Responding to the JIRA webhook using external events
3. Making an API request in server.js

### Prerequisites:

1. It is mandatory to have a Atlassian JIRA account (free trial available).
2. The app needs the Atlassian JIRA domain, username, and password to create and delete the webhook.

### Procedure to run the app:

1. Fill the `iparam_test_data.json` before running the app locally.
2. Run the app locally using the [`fdk run`](https://developers.freshchat.com/v2/docs/freshworks-cli/#run) command
3. Append `?dev=true` to the Freshworks product URL to see the changes
