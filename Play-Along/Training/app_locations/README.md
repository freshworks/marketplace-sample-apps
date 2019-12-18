## App Locations App

App locations specify the location in which apps can be rendered.

This app demonstrates the following features

1. [App locations](https://developers.freshdesk.com/v2/docs/app-locations/)
    - Ticket details page: ticket_sidebar.
    - Contact details page: contact_sidebar.
    - New Ticket page: new_ticket_requester_info.

2. [App Lifecycle events](https://developers.freshdesk.com/v2/docs/app-lifecycle-events/)
    - app.initialized(): method is called when the app is rendered for first time.
    - app.activated: event triggered whenever the app is brought into scope. It depends on app location.
    - app.deactivated: event triggered whenever the app is taken out of scope.

3. Using [Data APIs](https://developers.freshdesk.com/v2/docs/data-api/)
    - Ticket details page: To get 'contact' details of the ticket.
    - Contact details page: To get 'contact' and 'company' details of the contact.
    - New ticket page: To get Global data api 'loggedInUser'.