# React Todo app for freshdesk

## Description

This is a sample React app for Freshdesk using react CDN. It demonstrates how to use a React library in a Freshdesk app (will be the same for all the other Freshworks products)

***

## Screenshots


![App face](./Screenshots/app\ face.png)

***

## Features Demonstrated

App location: ticket_sidebar on ticket details page

| Feature | Notes |
| :---: | --- |
| [`Data Storage API`](https://developers.freshdesk.com/v2/docs/data-storage/) | Data storage API has been used to store and queue notes |
| React class components | React class components is used to render TodoList and Todo components and manages state |

## Prerequisites

1. Make sure you have a trial Freshdesk account created
2. A properly configured [Development environment](https://developers.freshdesk.com/v2/docs/quick-start/) along with the [FDK (Freshworks Development Kit)](https://developers.freshdesk.com/v2/docs/freshworks-cli/).
3. Basic exposure to React library

***

## Procedure to run the app

1. Run the app locally using the [`fdk run`](https://developers.freshdesk.com/v2/docs/freshworks-cli/#run) command.
2. Go to Freshdesk, navigate to the tickets page and select any ticket
3. Refer to the [Test your app](https://developers.freshdesk.com/v2/docs/quick-start/#test_your_app) section of the quickstart guide to allow insecure content.
4. Append `?dev=true` to the URL to see the changes

***

## Additional Notes

* This is a very basic demonstration of using React library in a Freshdesk app.
* React has other powerful features which can be implemented in various other ways.
