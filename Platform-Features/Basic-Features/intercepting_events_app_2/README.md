## Intercepting Events App 2

Whenever a ticket is closed, this app checks if there are any tags attached to the ticket and if no tags are attached, stops the close event and displays an error notification.

![](screenshots/interceptingCloseOnNoTags.gif)

This app demonstrates the following features:

1. Using data API to fetch the ticket's data.
2. Using intercept APIs to check and stop the close action if there are no tags attached to the ticket.
