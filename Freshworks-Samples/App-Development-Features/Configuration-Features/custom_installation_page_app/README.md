# Custom Installation Page App

### Description:

_This app uses a custom installation page to get input from the user through a color picker form element. It also dynamically populates a drop down field by making an API call. These values are then used in the ticket details page to render the drop down field value in the selected background color._

### Screenshots:

![](screenshots/appView.png)

| Features demonstrated      | Notes                                                      |
| -------------------------- | ---------------------------------------------------------- |
| _Request Api_              | _It is uses client.request to fetch data from API_         |
| _Custom installation page_ | _Custom config page for setting up and installing the app_ |

### Prerequisites:

1. Make sure you have a trial _Freshdesk_ account created
2. Ensure that you have the Freshworks Developer Kit (FDK) installed properly.

### Procedure to run the app:

1. Run the app locally using the [`fdk run`](https://developers.freshchat.com/v2/docs/freshworks-cli/#run) command
2. Append `?dev=true` to the Freshworks product URL to see the changes
3. go to [`custom_config`](http://localhost:10001/custom_configs) page to change the settings of the app.
