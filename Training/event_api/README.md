## [Event API](https://developers.freshdesk.com/v2/docs/events-api/)

Event APIs enable you to react to events that occur in the user interface of the page.

This app demonstrates the following features

1. App locations 
    - Ticket details page: ticket_background

2. Demostrate Event APIs
    - Change event: 'ticket.statusChanged' triggered when status is changed in UI. 
    - Button click event: 'ticket.replyClick' triggered when reply button is clicked. 
    - Intercepting event: 'ticket.propertiesUpdated' triggered when properties update button is clicked and property update is paused while the event listener executes.