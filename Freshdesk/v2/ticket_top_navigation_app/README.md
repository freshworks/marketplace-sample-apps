## Ticket Top Navigation App

This app adds a shortcut to start the timer in the top navigation of the ticket details page. On clicking the app icon, the Start Timer form will be shown.

![](screenshots/fullShot.png)

This app demonstrates the following features

1. App location - ticket_top_navigation.
2. Using Interface APIs for opening a modal.
3. Using Request APIs for fetching agent list.
4. Using Instance APIs to send the message (Start timer inputs) from the modal to the app.
5. Using Interface APIs for starting the timer.

Note:
Interface APIs are not accessible in the Modal. So, the data has to be passed from the modal to the parent location which then starts the timer.
