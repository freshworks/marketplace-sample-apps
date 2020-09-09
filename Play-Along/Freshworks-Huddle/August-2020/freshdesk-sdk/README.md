# Freshdesk SDK Demo App

## Description

This app showcases the Freshdesk SDK to make CRUD operation with Tickets module and Search Contact on Freshdesk.

Features demonstrated | Notes
-------------------- | ------
[Freshdesk SDK - Create Ticket](https://developer.freshworks.com/freshdesk-sdk/docs/TicketsApi.html#createticket) | To create a ticket using Freshdesk SDK
[Freshdesk SDK - Get Ticket](https://developer.freshworks.com/freshdesk-sdk/docs/TicketsApi.html#getticket) | To get a ticket details using Freshdesk SDK
[Freshdesk SDK - Update Ticket](https://developer.freshworks.com/freshdesk-sdk/docs/TicketsApi.html#updateticket) | To update a ticket properties using Freshdesk SDK
[Freshdesk SDK - Delete Ticket](https://developer.freshworks.com/freshdesk-sdk/docs/TicketsApi.html#deleteticket) | To delete a ticket using Freshdesk SDK
[Freshdesk SDK - Search Contact](https://developer.freshworks.com/freshdesk-sdk/docs/ContactsApi.html#searchcontacts) | To search contacts using Freshdesk SDK

## Prerequisites

1. Make sure you have a Freshdesk account created.
2. Ensure that you have the Freshworks Developer Kit (FDK) installed properly.
3. Install the [Freshdesk SDK NPM](https://www.npmjs.com/package/@freshworks/freshdesk) and [specify the dependency in the manifest.json file](https://developer.freshdesk.com/v2/docs/external-libraries/#npm_packages).

## Procedure to run the app

1. Run the app locally using the [`fdk run`](https://developer.freshdesk.com/v2/docs/quick-start/#test_your_app) command.
2. Append `?dev=true` to the Freshworks product URL to see the changes.

### Additional Comments

Checkout the [Freshdesk SDK documentation](https://developer.freshworks.com/freshdesk-sdk) to see the other available methods to try them out and utilise them instead of approaching the Freshdesk API in the Freshworks apps.

This app can be run from Glitch [here](https://glitch.com/~freshdesk-sdk-demo) by remixing and connecting it with your local system with [FWGL CLI](https://www.npmjs.com/package/fwgl) to see the app in action in your Freshdesk account similar to locally run application. :wink:
