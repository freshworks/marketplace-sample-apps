# Freshsales Integration

## Description

The sample Freshsales integration app will allow the agents to fetch additional details about the requester from Freshsales.

---

## Screenshots

<img src="./screenshots/installation page.png">

---

## Features demonstrated

App Location: ticket_sidebar on ticket details page

|                                       Feature                                       | Notes                                                                                     |
| :---------------------------------------------------------------------------------: | ----------------------------------------------------------------------------------------- |
|        [`Interface API`](https://developer.freshservice.com/docs/interface/)        | Interface API specifically _showNotify_ has been used to communicate errors with the user |
| [`Data API`](https://developer.freshservice.com/docs/data-api/#ticket_details_page) | Data API on ticket details page has been used to retrieve ticket requester's information  |
|        [`Request API`](https://developer.freshservice.com/docs/request-api/)        | Request API has been used to search and retrieve requesters information from freshsales   |

---

## Prerequisites

1. Make sure you have a Freshservice and Freshsales trail account created.
2. Ensure that your [Development environment](https://developer.freshservice.com/docs/quick-start/) along with the [FDK (Freshworks Development Kit)](https://developer.freshservice.com/docs/freshworks-cli/) is set up and configured properly.

---

## Procedure to run the app

1. Run the app locally using the [`fdk run`](https://developers.freshservice.com/docs/freshworks-cli/#_run) command.
2. visit `http://localhost:10001/custom_configs/` in your browser to
   view installation page.
3. Enter your freshsales subdomain, username and password and click install.
4. Go to Freshservice, navigate to the tickets page and select any ticket.
5. Refer to the [Test your app](https://developer.freshservice.com/docs/quick-start/) section of the quickstart guide to allow insecure content.
6. Append `?dev=true` to the URL to run the app.
