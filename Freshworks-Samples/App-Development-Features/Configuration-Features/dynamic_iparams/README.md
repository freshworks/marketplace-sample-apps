# Dynamic Installation Page ✨

## Description
This sample app demonstrates how iparam callbacks can be used to improve validation and make the installation parameters much more dynamic. This approach cuts the need for custom installation parameters and leverages the simplicity and power of standard iparams (iparams.json).

## Screenshots

![Preview of iparam callback validation app](./app/assets/img/preview.png)

## Features Demonstrated

App location: ticket details page

| Feature | Notes |
| :---: | --- |
| [`Request methods`](https://developers.freshdesk.com/v2/docs/request-api/) |   Request API is used to facilitate third-party REST API calls from iparams.js|
| [`iparam utility methods`](https://developers.freshdesk.com/v2/docs/installation-parameters/#dynamic_install_page) |   Utility methods facilitate iparam field manipulation |

## Prerequisites

1. Make sure you have a trial Freshdesk account created
2. A properly configured [Development environment](https://developers.freshdesk.com/v2/docs/quick-start/) along with the [FDK (Freshworks Development Kit)](https://developers.freshdesk.com/v2/docs/freshworks-cli/).


## Procedure to run the app

1. Run the app locally using the [`fdk run`](https://developers.freshdesk.com/v2/docs/freshworks-cli/#run) command.
2. Go to `http://localhost:10001/custom_configs` in your browser to test the installation page
3. You can add new callback functions associated with iparam fields in `iparams.js`
4. You can also modify the code directly in the `iparams.js` file to see the changes in the Installation pages.

