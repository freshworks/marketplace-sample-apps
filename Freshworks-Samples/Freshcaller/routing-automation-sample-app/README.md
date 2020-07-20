# Simple Request App

## Description

A sample serverless app that depicts the actions that could be performed using the Freshcaller's Routing Automation feature that leverages the workflow automation ability of Freshworks marketplace platform. For more information on Routing automation, please refer to the following KB articles 

1.https://support.freshcaller.com/en/support/solutions/articles/50000002321-overview-of-routing-automation
2.https://support.freshcaller.com/en/support/solutions/articles/50000002359-configuring-routing-automation-call-flow
3.https://support.freshcaller.com/en/support/solutions/articles/50000002451-routing-automation-use-cases

## Features Demonstrated
A serverless app that has the following list of function each depicting an input/response pair allowed in routing automation call flow inside Freshcaller.

Function | Notes
:--------------------: | ------
 [`validateUserPhoneNumber`] | a function which takes calling customers number as input and sends a response after processing.
 [`validateUserSingleDigit`] | a function which takes single digit input as an input from customer and sends a response after processing.
 [`validateUserMultipleDigits`] | a function which takes multiple digit as an input from customers and sends a response after processing.
 [`validateUserSpeech`] | a function which takes users speech as input and sends the transcripted text as input from customer to the function and a response after processing is sent back to Freshcaller.
 [`respondOrderStatus`] | a function which higlights the Freshcallers ability to read a dynamic message based on the real time processed response from the app.

***

## Prerequisites

1. A trial Freshcaller account.
2. A properly configured [Development environment](https://developers.freshcaller.com/docs/quick-start/) along with the [FDK (Freshworks Development Kit)]

***

## Procedure to run the app

1. Run the app locally using the [`fdk run`] command.
2. Go to `http://localhost:10001/custom_configs` in your browser to set up your Freshsales account URL and Freshsales API key.
3. Go to Freshsales, on the Home page, from the left global sidebar, select the Leads tab and click any lead.
4. Refer to the [Test your app](https://developers.freshcaller.com/docs/quick-start/#test_the_app) section of the quickstart guide to allow insecure content.
5. Append `?dev=true` to the URL to see the app rendered at the bottom of the page.

***

## Additional Notes

- You can find your API key in the following way
  - Navigate to your Freshcaller domain and log in to your account.
  - Click the profile icon on the right side of the page. A menu is displayed.
  - Click Profile Settings. The Profile Settings window is displayed. The API key  (access-token) is displayed under YOUR API KEY.
  