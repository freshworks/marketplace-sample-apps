# Twilio SMS

## Description

This app enables an agent to send a custom message as an SMS.

---

## Screenshots

<img src="./screenshots/App face.png" width="300">

---

## Features Demonstrated

App location: ticket details page

|                                Feature                                 | Notes                                                                                                                                                        |
| :--------------------------------------------------------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`Request API`](https://developers.freshdesk.com/v2/docs/request-api/) | Request API is used to facilitate [`SMI`](https://developers.freshdesk.com/v2/docs/server-method-invocation/) which in turn calls twilio api to send message |

## Prerequisites

1. Make sure you have a trial Freshdesk account created
2. A properly configured [Development environment](https://developers.freshdesk.com/v2/docs/quick-start/) along with the [FDK (Freshworks Development Kit)](https://developers.freshdesk.com/v2/docs/freshworks-cli/).
3. A trial twilio account with SID and auth token.

---

## Procedure to run the app

1. Run the app locally using the [`fdk run`](https://developers.freshdesk.com/v2/docs/freshworks-cli/#run) command.
2. Go to `http://localhost:10001/custom_configs` in your browser to set up your Twilio account SID, authentication token and phone number
3. Go to Freshdesk, navigate to the tickets page and select any ticket
4. Refer to the [Test your app](https://developers.freshdesk.com/v2/docs/quick-start/#test_your_app) section of the quickstart guide to allow insecure content.
5. Append `?dev=true` to the URL to see the changes

---

## Additional Notes

- This app sends the SMS using the Twillio phone number. You can get this number at https://www.twilio.com/console/phone-numbers/getting-started once you have registered.
