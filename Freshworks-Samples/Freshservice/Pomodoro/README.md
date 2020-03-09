# Pomodoro App

### Description

The Pomodoro app lets the users to schedule work sessions based on pomodoro technique.

> The pomodoro technique is a productivity hack. It splits the work time into small segments where each segment is made up of 25 minutes work and 5 minutes break. By taking small breaks in between 25 short work sessions you can boost your productivity significantly and reduce the risk of being exhausted and unproductive.

* * *

### Screenshots

<img src="./Screenshots/App Face.png" width="250">  

for other screenshots please refer to the [Screenshots](https://github.com/Raj-1337/Pomodoro_App/tree/master/Screenshots) folder

* * *

### Feautres Demonstrated

| Feature | Notes |
| --- | --- |
| [`Interface API`](https://developer.freshservice.com/docs/interface/) | Interface API to notify users about thier session progress|
| [`Data API`](https://developer.freshservice.com/docs/data-api/) | Data API is used to retrieve the id of the user logged in |
| [`SMI`](https://developer.freshservice.com/docs/server-method-invocation/) | SMI  (Server Method Invocation) is used by the app to call the serverless components|
| [`Instance API`](https://developer.freshservice.com/docs/instance-api/#parenttomodal) | Instance API, _specifically the parent to modal using context_ has been used to send the user's history to the modal where it will be displayed as a chart|
| [`Data Storage`](https://developer.freshservice.com/docs/data-storage/) | Various data storage commands have been used to store and manipulate user's data |
| [`Scheduled Events`](https://developer.freshservice.com/docs/scheduled-events/) | Scheduled events are used to manipulate user's data |

* * *

### Prerequisites

1. Make sure you have a trial Freshservice account created
2. Ensure that your [Development environment](https://developer.freshservice.com/docs/quick-start/) along with the [FDK (Freshworks Development Kit)](https://developer.freshservice.com/docs/freshworks-cli/) is set up and configured properly.

* * *

### Procedure to run the app

1. Run the app locally using the [`fdk run`](https://developers.freshchat.com/v2/docs/freshworks-cli/#run) command.
2. Navigate to the tickets page and select any ticket
3. Append `?dev=true` to the URL to see the changes

    > **NOTE:** If you dont see anything please refer to the [test your app](https://developer.freshservice.com/docs/quick-start/) section of the quickstart guide to allow insecure content.

* * *

### Additional Notes

* The Clear data button clears all the history of the user.
* The Show activity button shows the user's history in a chart form created using google charts.
* The Test data button populates the user's history with random data.
* The timer doesn't get reset if the user reloades the page or moves to another ticket.
* when the session is stopped midway, it is recorded as interruption. This information is used along with no of sessions is used to produce chart where the user can assess his productivity by himself.
