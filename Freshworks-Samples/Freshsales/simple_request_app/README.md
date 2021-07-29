# Simple Request App

## Description

A sample app that fetches and displays details about the current Lead in the Lead Details page

---

## Screenshots

<img src="./screenshots/App face.png">

---

## Features Demonstrated

App location : lead_entity_menu

|                               Feature                               | Notes                                                                                                                                |
| :-----------------------------------------------------------------: | ------------------------------------------------------------------------------------------------------------------------------------ |
|    [`Data API`](https://developers.freshsales.io/docs/data-api/)    | Data API is used to fetch the current lead ID                                                                                        |
| [`Request API`](https://developers.freshsales.io/docs/request-api/) | Request API is used to fetch lead details using lead ID by making a call to [`Freshsales API`](https://www.freshsales.io/api/#leads) |

---

## Prerequisites

1. A trial Freshsales account.
2. A properly configured [Development environment](https://developers.freshsales.io/docs/quick-start//) along with the [FDK (Freshworks Development Kit)](https://developers.freshsales.io/docs/freshsales-sdk/).

---

## Procedure to run the app

1. Run the app locally using the [`fdk run`](https://developers.freshsales.io/docs/freshsales-sdk/#_run) command.
2. Go to `http://localhost:10001/custom_configs` in your browser to set up your Freshsales account URL and Freshsales API key.
3. Go to Freshsales, on the Home page, from the left global sidebar, select the Leads tab and click any lead.
4. Refer to the [Test your app](https://developers.freshsales.io/docs/quick-start/#test_your_app) section of the quickstart guide to allow insecure content.
5. Append `?dev=true` to the URL to see the app rendered at the bottom of the page.

---

## Additional Notes

- You can find your API key in the following way
  - click on your profile picture in top right corner.
  - click on settings.
  - click on API settings tab.
  - complete the captcha to view your API key.
