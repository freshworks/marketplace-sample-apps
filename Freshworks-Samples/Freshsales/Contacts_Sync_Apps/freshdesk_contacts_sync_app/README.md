# Freshdesk contacts sync App

## Description

This app automatically updates the relevant contact's details in Freshdesk over an API request whenever a contact is updated in Freshsales.

---

## Features Demonstrated

Type of app: serverless

|                                  Feature                                  | Notes                                                                                                                                                             |
| :-----------------------------------------------------------------------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`Product Events`](https://developers.freshsales.io/docs/product-events/) | Product events such as _onContactCreate_ and _onContactUpdate_ has been used as triggers to invoke the app and sync the contacts between Freshdesk and Freshsales |
|   [`Data storage`](https://developers.freshsales.io/docs/data-storage/)   | Data storage API (serverless) is used to store the contact id mapping between Freshsales and Freshdesk                                                            |
|    [`Request API`](https://developers.freshsales.io/docs/request-api/)    | Request API is used to communicate with the Freshdesk                                                                                                             |

---

## Prerequisites

1. Trial Freshsales and Freshdesk accounts.
2. A properly configured [Development environment](https://developers.freshsales.io/docs/quick-start/#) along with the [FDK (Freshworks Development Kit)](https://developers.freshsales.io/docs/freshsales-sdk/).

---

## Procedure to run the app

1. Run the app locally using the [`fdk run`](https://developers.freshsales.io/docs/freshsales-sdk/#_run) command.
2. Go to `http://localhost:10001/custom_configs` in your browser to set up your Freshdesk account URL and Freshdesk API key.
3. Refer to the [Test your app](https://developers.freshsales.io/docs/quick-start/#test_your_app) section of the quickstart guide to allow insecure content.
4. Append `?dev=true` to the URL.

---

## Additional Notes

- create or update contacts details to see it get refected across Freshdesk.
- you can get the API key of Freshdesk in following way
  - Log in to your support portal.
  - Click on your profile picture on the top right corner of your portal.
  - Go to Profile settings Page
  - Your API key will be available below the change password section to your right
