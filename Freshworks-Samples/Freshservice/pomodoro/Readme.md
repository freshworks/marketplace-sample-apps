# pomodoro

## Description

 The pomodoro app lets the user set tasks and use pomodoro to schedule work and breaks

***

## Screenshots

<img src="./screenshots/screenshot.png">

***

## Features demonstrated

  App location: ticket_sidebar

  | Feautre | Notes |
  | :---: | --- |
  | [`Data API`](https://developer.freshservice.com/docs/data-api/) | Data API has been used to retrieve _loggedInUser_ |
  | [`Interface API`](https://developer.freshservice.com/docs/interface/#global_interface_apis) | Interface API specifically _global interface api_ has been used to show modal and various notifications|
  | [`Data Strorage`](https://developer.freshservice.com/docs/data-storage/) | _data storage_ has been used to set,get,update and delete the todo list values|
  | [`Scheduled Events`](https://developer.freshservice.com/docs/scheduled-events/) | _scheduled events_ has been used to set timer for task as well as break|
  | [`App Setup Events`](https://developer.freshservice.com/docs/app-setup-events/) | _app setup events_ has been used to set the value in db for seting the starting value of index for todo list|
  | [`Server Method Invocation`](https://developer.freshservice.com/docs/server-method-invocation/) | _client.request.invoke_ has been used to invoke the creation of schedule when the user click the button for pomodoro in front end|
  | [`Instance API`](https://developer.freshservice.com/docs/instance-api/) | _client.instance.resize_ has been used to set the size for the app|
  

***

## Prerequisites

1. Make sure you have a trial Freshservice account created
2. Ensure that your [Development environment](https://developer.freshservice.com/docs/quick-start/) along with the [FDK (Freshworks Development Kit)](https://developer.freshservice.com/docs/quick-start/#test_your_app) is set up and configured properly.

***

## Procedure to run the app

1. Run the app locally using the [`fdk run`](https://developers.freshservice.com/docs/freshworks-cli/#_run) command.
2. Go to Freshservice, navigate to the tickets page and select any ticket.
3. Refer to the [Test your app](https://developer.freshservice.com/docs/quick-start/#test_your_app) section of the quickstart guide to allow insecure content.
4. Append `?dev=true` to the URL to run the app.

***
