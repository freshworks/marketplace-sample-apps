# Notes Reminder App

## Description

You can add a note and set a reminder so that app will remind your note after a set period of time as scheduled.

***

## Screenshots

<img src="./Screenshots/App Face.png" height="300" width="300">

***

## Features Demonstrated

App location: ticket_sidebar on ticket details page

| Feature | Notes |
| :---: | --- |
| [`Data Storage API`](https://developer.freshservice.com/docs/data-storage/) | Data storage API is used to store and queue notes |
| [`Interface API`](https://developer.freshservice.com/docs/interface/) | Interface API is used to power the notifications |
| [`SMI`](https://developer.freshservice.com/docs/server-method-invocation/) | Server Method invocation (SMI) is used to invoke _createSchedule_ serverless component when _Remind me_ button is clicked |

## Prerequisites

1. A trial Freshservice account
2. A properly configured [Development environment](https://developer.freshservice.com/docs/quick-start/) along with the [FDK (Freshworks Development Kit)](https://developer.freshservice.com/docs/freshworks-cli/)

***

## Procedure to run the app

1. Run the app locally using the [`fdk run`](https://developer.freshservice.com/docs/freshworks-cli/#_run) command.
2. Go to Freshdesk, navigate to the tickets page and select any ticket
3. Refer to the [Test your app](hhttps://developer.freshservice.com/docs/quick-start/#test_your_app) section of the quickstart guide to allow insecure content.
4. Append `?dev=true` to the URL to see the changes

***

## Additional Notes

- The Scheduled Events feature demonstrated here can only be really tested by uploading it as custom app.
- In local testing, the app runs the Scheduled code irrespective of the time actually scheduled.
- This app when stores the data in db. You can find db in local testing under .fdk/localstore file.
