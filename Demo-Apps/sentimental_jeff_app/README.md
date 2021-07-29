# Sentimental Jeff App

## Description

This app analyses the ticket sentiment of the requestor and rates it. It can tell you if the tone of the message is happy, sad, or indifferent.

---

## Screenshots

![appView](./screenshots/appView.png)

---

## Features Demonstrated

Product: Freshdesk
App location: ticket_sidebar on Ticket Details Page

|                                           Feature                                            | Notes                                                                                                                                               |
| :------------------------------------------------------------------------------------------: | --------------------------------------------------------------------------------------------------------------------------------------------------- |
|               [`Data API`](https://developers.freshdesk.com/v2/docs/data-api)                | Data API is used to retrieve _Ticket Details_ and _Domain Name_                                                                                     |
|            [`Request API`](https://developers.freshdesk.com/v2/docs/request-api)             | Request API has been used to get the conversational details                                                                                         |
| [`Installation Parameters`](https://developer.freshdesk.com/v2/docs/installation-parameters) | Installation parameters used to let admins configure account _domain name_, _api key_, and _custom field_ to optionally update the sentiment result |
|       [`Interface Method`](https://developer.freshdesk.com/v2/docs/interface-methods)        | Interface method used to show error notifications to the user                                                                                       |

## Prerequisites

1. Make sure you have a trial Freshdesk account created
2. A properly configured [Development environment](https://developers.freshdesk.com/v2/docs/quick-start) along with the [FDK (Freshworks Development Kit)](https://developers.freshdesk.com/v2/docs/freshworks-cli).

---

## Procedure to run the app

1. Run the app locally using the [`fdk run`](https://developers.freshdesk.com/v2/docs/freshworks-cli/#run) command.
2. Go to `http://localhost:10001/custom_configs` in your browser to set up your Freshdesk API key
3. Go to Freshdesk, navigate to the tickets page and select any ticket
4. Refer to the [Test your app](https://developers.freshdesk.com/v2/docs/quick-start/#test_your_app) section of the quickstart guide to allow insecure content.
5. Append `?dev=true` to the URL to see the changes

---

## Notes

- you can get the API key of Freshdesk in following way
  - Log in to your support portal.
  - Click on your profile picture on the top right corner of your portal.
  - Go to Profile settings Page
  - Your API key will be available on the right side above sort conversations.
