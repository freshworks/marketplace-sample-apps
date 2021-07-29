# External Events App

## Description:

This app creates a ticket in Freshdesk every time an issue created for the configured repository in GitHub.

---

## Screenshots

---

## Feature Demonstrated

|     Feature      | Notes                                                                              |
| :--------------: | ---------------------------------------------------------------------------------- |
| App setup events | onAppInstall and onAppUninstall events is used to create and delete Github webhook |
| External Events  | External event (triggered by Github) is used to create Freshdesk tickets           |

---

## Prerequisites:

1. Make sure you have a trial Freshdesk account created
2. Ensure that you have the Freshworks Developer Kit (FDK) installed properly.
3. Create an OAuth App - [Link](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/)
4. Register GitHub webhook - [Link](https://developer.github.com/webhooks/creating/)
5. The app needs the GitHub username, to authenticate the app to create and delete the webhook over REST API.
6. The ngrok application installed in the local machine to expose localhost to the internet

---

## Procedure to run the app:

1. Fill the `iparam_test_data.json` before running the app locally.
2. Run the app locally using the [`fdk run`](https://developers.freshchat.com/v2/docs/freshworks-cli/#run) command
3. Append `?dev=true` to the Freshworks product URL to see the changes
