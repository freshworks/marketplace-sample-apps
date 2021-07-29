# Scheduled Events Sample App

## Description

This app enables agents to schedule the creation of tickets.

---

## Screenshots

![](screenshots/appView.png)

---

## Features Demonstrated

App location: ticket_sidebar on ticket details page

|                                     Feature                                      | Notes                                                                                                                           |
| :------------------------------------------------------------------------------: | ------------------------------------------------------------------------------------------------------------------------------- |
|    [`Interface API`](https://developers.freshdesk.com/v2/docs/interface-api/)    | Interface API is used to show modal and notifications.                                                                          |
|         [`Data API`](https://developers.freshdesk.com/v2/docs/data-api/)         | Data API is used to store list of schedules                                                                                     |
|   [`SMI`](https://developers.freshdesk.com/v2/docs/server-method-invocation/)    | SMI (Server Method Invocation) is used to call various helper methods which creates, fetches, updates and deletes schedules     |
| [`Scheduled Events`](https://developers.freshdesk.com/v2/docs/scheduled-events/) | _onScheduledEvent_ is used to [create](https://developers.freshdesk.com/api/#create_ticket) tickets using Freshdesk Tickets API |

## Prerequisites

1. Make sure you have a trial Freshdesk account created.
2. A properly configured [Development environment](https://developers.freshdesk.com/v2/docs/quick-start/) along with the [FDK (Freshworks Development Kit)](https://developers.freshdesk.com/v2/docs/freshworks-cli/).
3. Freshdesk API Key.

---

## Procedure to run the app

1. Run the app locally using the [`fdk run`](https://developers.freshdesk.com/v2/docs/freshworks-cli/#run) command.
2. Go to Freshdesk, navigate to the tickets page and select any ticket
3. Refer to the [Test your app](https://developers.freshdesk.com/v2/docs/quick-start/#test_your_app) section of the quickstart guide to allow insecure content.
4. Append `?dev=true` to the URL to see the app.

---

## Additional Notes

You can get the Freshdesk API key in the following way:

1. Log in to your support portal.
2. Click on your profile picture on the top right corner of your portal
3. Select profile settings from the dropdown.
4. Your API key will be available below the change password section to your right
