# Timer On Tap

### Description:

This app adds a shortcut to start the timer in the top navigation of the ticket details page. On clicking the app icon, the Start Timer form will be shown.

| Features demonstrated | Notes                                                               |
| --------------------- | ------------------------------------------------------------------- |
| App location          | ticket_top_navigation                                               |
| Interface API         | To Open a Modal                                                     |
| Request APIs          | Fetching Agent List                                                 |
| Instance API          | To send the message (Start timer inputs) from the modal to the app. |
| Interface API         | To start the timer                                                  |

### Prerequisites:

1. Make sure you have a trial Freshdesk account created
2. Ensure that you have the Freshworks Developer Kit (FDK) installed properly.

_[From point 3, add some of the important prerequisites which are specific to this app]_

### Procedure to run the app:

1. Fill the `iparam_test_data.json` before running the app locally.
2. Run the app locally using the [`fdk run`](https://developers.freshchat.com/v2/docs/freshworks-cli/#run) command
3. Append `?dev=true` to the Freshworks product URL to see the changes

_[ Special instructions for realizing the value out of this app]_

### Screenshots:

![](screenshots/fullshot.png)

###### Protip

- Interface APIs are not accessible in the Modal. So, the data has to be passed from the modal to the parent location which then starts the timer.
