# Ticket Merger

## Description

Merges Tickets created by the same requester within a configurable time window. Also adds useful notes on the tickets mentioning the ticket to/from which the merge was done. Requires the Freshdesk API key to make the necessary API calls to add notes, close tickets etc.

---

## Screenshots

![](screenshots/simulation.gif)

---

## Features Demonstrated

App location: ticket details page background

|                                           Feature                                           | Notes                                                                                                                                          |
| :-----------------------------------------------------------------------------------------: | ---------------------------------------------------------------------------------------------------------------------------------------------- |
|        [`Data storage API`](https://developers.freshdesk.com/v2/docs/data-storage/)         | Data storage API is used to keep track of tickets and requesters                                                                               |
|           [`Request API`](https://developers.freshdesk.com/v2/docs/request-api/)            | Request API is used to communicate with Freshdesk to merge tickets using Freshdesk [`coreAPIs`](https://developers.freshdesk.com/api/#tickets) |
| [`Product events`](https://developers.freshdesk.com/v2/docs/product-events/#onticketcreate) | Specifically _onTicketCreate_ event is used to trigger the app                                                                                 |

## Prerequisites

1. Make sure you have a trial Freshdesk account created
2. A properly configured [Development environment](https://developers.freshdesk.com/v2/docs/quick-start/) along with the [FDK (Freshworks Development Kit)](https://developers.freshdesk.com/v2/docs/freshworks-cli/).

---

## Procedure to run the app

1. Run the app locally using the [`fdk run`](https://developers.freshdesk.com/v2/docs/freshworks-cli/#run) command.
2. Go to `http://localhost:10001/custom_configs` in your browser to set up your Freshdesk API key and window duration period.
3. Go to Freshdesk, navigate to the tickets page and select any ticket
4. Refer to the [Test your app](https://developers.freshdesk.com/v2/docs/quick-start/#test_your_app) section of the quickstart guide to allow insecure content.
5. Append `?dev=true` to the URL to see the changes

---

## Additional Notes

- you can get the API key of Freshdesk in following way
  - Log in to your support portal.
  - Click on your profile picture on the top right corner of your portal.
  - Go to Profile settings Page
  - Your API key will be available on the right side above sort conversations.
