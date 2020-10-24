# FullContact Sample App for Freshchat

## Description 
You can search a person's details using this app that uses fullcontact's API in the background to display details. The App stores the last 5 viewed person's profile.
***

## Screenshots

<img src="./screenshots/App face.png" height="300" width="500">


***

## Features Demonstrated

App location: conversation_user_info on inbox page.

| Feature | Notes |
| :---: | --- |
| [`Data Storage API`](https://developers.freshchat.com/v2/docs/data-storage/) | Data storage API has been used to store and queue notes |
| [`Interface API`](https://developers.freshchat.com/v2/docs/interface-method/) | Interface API has been used to power the notifications |
| [`Request API`](https://developers.freshchat.com/v2/docs/request-method/)| Request API is used to communicate with [`Enrich API`](https://dashboard.fullcontact.com/api-ref#multi-field-request)| to get person's information
| [`Interface API`](https://developers.freshdesk.com/v2/docs/instance-api/) | Instance API is used to send data to parent location |

## Prerequisites

1. Make sure you have a trial Freshchat account created
2. A properly configured [Development environment](https://developers.freshchat.com/v2/docs/quick-start/) along with the [FDK (Freshworks Development Kit)](https://developers.freshchat.com/v2/docs/freshworks-cli/).

***

## Procedure to run the app

1. Run the app locally using the [`fdk run`](https://developers.freshchat.com/v2/docs/quick-start/#install_the_cli) command.
2. Go to Freshchat, navigate to the inbox page.
3. Refer to the [Test your app](https://developers.freshchat.com/v2/docs/quick-start/#test_your_app) section of the quickstart guide to allow insecure content.
4. Append `?dev=true` to the URL to see the changes

***

