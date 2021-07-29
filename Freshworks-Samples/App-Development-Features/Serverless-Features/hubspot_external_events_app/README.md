# Hubspot-Freshdesk Contacts Sync App

## Description:

This app creates a contact in Freshdesk every time a contact is created in Hubspot and also creates a contact in Hubspot everytime a contact is created in Freshdesk (bidirectional). So the contacts created in Hubspot or Freshdesk are always in sync with each other.

---

## Screenshots:

![](screenshots/View1.png)

![](screenshots/View2.png)

![](screenshots/View3.png)

![](screenshots/View4.png)

---

## Features demonstrated

| Feature          | Notes                                 |
| ---------------- | ------------------------------------- |
| App Setup events | To create and delete Hubspot webhoook |
| external events  | Responding to the Hubspot webhook     |

---

## Prerequisites:

1. Make sure you have a trial Freshdesk account created
2. A properly configured [Development environment](https://developers.freshdesk.com/v2/docs/quick-start/) along with the [FDK (Freshworks Development Kit)](https://developers.freshdesk.com/v2/docs/freshworks-cli/).
3. The app needs the app identifier, Hubspot username, password, developer and production API keys to create and delete the webhook and making API requests.

---

## Procedure to run the app:

1. Run the app locally using the [`fdk run`](https://developers.freshdesk.com/v2/docs/freshworks-cli/#run) command
2. visit `http://localhost:10001/custom_configs` in your browser and setup your Hubspot credentials.
3. create an contact in Hubspot to see it get reflected in Freshdesk.
