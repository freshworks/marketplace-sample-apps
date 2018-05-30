## Freshservice sample apps
This repository contains sample apps demonstrating the various features available in the App Framework. It contains the following apps:

### [Conditional Ticket Properties](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshservice/conditional_ticket_properties)

The Conditional ticket properties app lets admin hide the default type field from the ticket details page. Additionally, based on the ticket priority chosen, admin is able to hide the close button, restricting the edition of due date, disable type, group, impact ticket properties & as well add a default private note. This app also hides the urgency and impact properties if the logged in agent is from the HR group.

Conditional ticket properties app demonstrates -

1. Rendering apps on Ticket details page (background location)
2. Usage of Global data APIs
3. Usage of Events and Interface APIs on ticket details page

### [Freshsales Integration](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshservice/freshsales_integration)

The sample Freshsales integration app will allow the agents to fetch additional details about the requester from Freshsales.

The sample Freshsales integration app demonstrates -

1. Rendering apps on Ticket details page (sidebar location)
2. usage of request APIs

### [Onclick Alerts](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshservice/onclick_alerts)

The Onclick alerts app displays notification on updating ticket properties and confirmation for ticket closure. Also the app will show additional ticket context regarding child tickets that have been added to the parent ticket.

The sample Onclick Alerts app demonstrates -

1. Rendering apps on Ticket details page (background location)
2. Usage of Event APIs and global interface APIs

### [Simple Request App](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshservice/show_ticket_and_associated_details)

The  Show Ticket and Associated Details app leverages the data APIs in the ticket details page to show additional relevant information about the ticket. Based on the selection from the dropdown, an agent can now get more context about few of the aspects like (and not limiting to) the requester, ticket associations such as Problem, Change, Assets etc.

The app demonstrates - 

1. Rendering apps on Ticket details page (sidebar location).
2. Usage of Data APIs for Ticket details page.
