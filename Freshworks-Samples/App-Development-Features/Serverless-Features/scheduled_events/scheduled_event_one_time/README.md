# Scheduled Events (One Time)

## Description

This app enables agents to schedule a note to be added later to a ticket.

---

## Screenshots

<img src="./Screenshots/App face.png" height="300" width="300">

---

## Features Demonstrated

App location: ticket_top_navigation on ticket details page

|                                     Feature                                      | Notes                                                                                             |
| :------------------------------------------------------------------------------: | ------------------------------------------------------------------------------------------------- |
|     [`Instance API`](https://developers.freshdesk.com/v2/docs/instance-api/)     | Instance API is used to send data to and from modal                                               |
|    [`Interface API`](https://developers.freshdesk.com/v2/docs/interface-api/)    | Interface API is used to show modal and notifications.                                            |
|   [`SMI`](https://developers.freshdesk.com/v2/docs/server-method-invocation/)    | SMI (Server Method Invocation) is used to _createSchedule_ method which creates a scheduled event |
| [`Scheduled Events`](https://developers.freshdesk.com/v2/docs/scheduled-events/) | _onScheduledEvent_ is used to add note to the particular ticket                                   |

## Prerequisites

1. Make sure you have a trial Freshdesk account created
2. A properly configured [Development environment](https://developers.freshdesk.com/v2/docs/quick-start/) along with the [FDK (Freshworks Development Kit)](https://developers.freshdesk.com/v2/docs/freshworks-cli/).

---

## Procedure to run the app

1. Run the app locally using the [`fdk run`](https://developers.freshdesk.com/v2/docs/freshworks-cli/#run) command.
2. Go to Freshdesk, navigate to the tickets page and select any ticket
3. Refer to the [Test your app](https://developers.freshdesk.com/v2/docs/quick-start/#test_your_app) section of the quickstart guide to allow insecure content.
4. Append `?dev=true` to the URL to see the app loaded in the ticket_top_navigation
5. click on the schedule icon to open a modal.
6. Give a name and time to schedule and press schedule button.
7. Notes will be added to the ticket after the stipulated time.
