# Server Method Invocation

## Description

A simple serverless app to demonstrate the usage of server method invocation.

***

## Screenshots

<img src="./screenshots/App Face.png" width="300">

for other screenshots, please refer to [screenshots](./screenshots/) folder.

***

## Features Demonstrated

App location: ticket_sidebar on ticket details page

| Feature | Notes |
| :---: | --- |
| [`SMI`](https://developers.freshdesk.com/v2/docs/server-method-invocation/) | SMI (Server Method Invocation) is used to invoke _makeRequest_ serverless component which makes a simple get request and post the response in the console logs|

***

## Prerequisites

1. Make sure you have a trial Freshdesk account created.
2. A properly configured [Development environment](https://developers.freshdesk.com/v2/docs/quick-start/) along with the [FDK (Freshworks Development Kit)](https://developers.freshdesk.com/v2/docs/freshworks-cli/).

***

## Procedure to run the app

1. Run the app locally using the [`fdk run`](https://developers.freshdesk.com/v2/docs/freshworks-cli/#run) command.
2. Go to Freshdesk, navigate to the tickets page and select any ticket
3. Refer to the [Test your app](https://developers.freshdesk.com/v2/docs/quick-start/#test_your_app) section of the quickstart guide to allow insecure content.
4. Append `?dev=true` to the URL to see the app.