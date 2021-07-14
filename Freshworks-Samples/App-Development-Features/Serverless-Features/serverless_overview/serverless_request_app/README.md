# Serverless Request App

## Description

Every time a new ticket is created, this app makes an API request to HTTPbin.org and prints the response to the terminal window.

***

## Screenshots

![](screenshots/outputResponse.png)

***

## Features Demonstrated

| Feature | Notes |
| :---: | --- |
| [`Product Events`](https://developers.freshdesk.com/v2/docs/product-events) | The [_onTicketCreate_](https://developers.freshdesk.com/v2/docs/product-events/#onticketcreate) product event has been used to trigger the serverless app|

***

## Prerequisites

1. Make sure you have a trial Freshdesk account created.
2. A properly configured [Development environment](https://developers.freshdesk.com/v2/docs/quick-start/) along with the [FDK (Freshworks Development Kit)](https://developers.freshdesk.com/v2/docs/freshworks-cli/).

***

## Procedure to run the app

1. Run the app locally using the [`fdk run`](https://developers.freshdesk.com/v2/docs/freshworks-cli/#run) command.
2. Go to Freshdesk, navigate to the tickets page and create a new ticket.

***

## Additional notes

This app also shows how to handle the response of an API request using a internal library

> Disclaimer: The use of mock servers in production environment is disallowed. HttpBin.org can be used to debug or test your app's behavior locally. However, this will not work when the app is deployed in a live account. We recommend switching to a custom mock server controlled by you in such scenarios. 
