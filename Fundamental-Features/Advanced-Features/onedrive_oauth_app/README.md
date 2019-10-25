## OneDrive OAuth App

  This apps lists the files and folders available in your OneDrive account.

  This app demonstrates the following features

  1. OAuth 2.0 - account/agent level OAuth
  2. Request API - making an OAuth request with access_token

  ![](screenshots/appView.png)

> To have agent level OAuth, change the "token_type" in [oauth_config.json](./oauth_config.json) to "agent" instead of "account".


### Prerequisites:

1. It is mandatory to have a OneDrive account.
2. You must have an OAuth app registered in OneDrive - https://dev.onedrive.com/app-registration.htm.
