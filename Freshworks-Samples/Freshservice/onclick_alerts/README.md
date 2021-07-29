# Onclick alerts

## Description

The Onclick alerts app displays notification on updating ticket properties and confirmation for ticket closure. Also the app will show additional ticket context regarding child tickets that have been added to the parent ticket.

## Screenshots

<img src="./screenshots/AppFace.png" width="250">

For other screenshots please refer to [screenshots](./screenshots/) folder

---

## Features demonstrated

App location: ticket_sidebar on ticket details page

|                                       Feature                                       | Notes                                                                                                                                                                            |
| :---------------------------------------------------------------------------------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`Events API`](https://developer.freshservice.com/docs/events/#ticket_page_events)  | Events API specifically _ticket details page events_ has been used to trigger notifications on updating ticket properties.                                                       |
|        [`Interface API`](https://developer.freshservice.com/docs/interface/)        | Interface API specifically _show notifications_ and _show modal_ has been used to notify users on updating ticket properties and displaying child ticket properties respectively |
| [`Data API`](https://developer.freshservice.com/docs/data-api/#ticket_details_page) | Data API has along with _recentChildTickets_ been used to retrieve child ticket properties.                                                                                      |

---

## Prerequisites

1. Make sure you have a trial Freshservice account created
2. Ensure that your [Development environment](https://developer.freshservice.com/docs/quick-start/) along with the [FDK (Freshworks Development Kit)](https://developer.freshservice.com/docs/freshworks-cli/) is set up and configured properly.

---

## Procedure to run the app

1. Run the app locally using the [`fdk run`](https://developers.freshservice.com/docs/freshworks-cli/#_run) command.
2. Go to Freshservcie, navigate to the tickets page and select any ticket
3. Refer to the [Test your app](https://developer.freshservice.com/docs/quick-start/) section of the quickstart guide to allow insecure content.
4. Append `?dev=true` to the URL to see the changes
