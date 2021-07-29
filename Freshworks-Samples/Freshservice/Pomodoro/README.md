# Pomodoro App

### Description

The pomodoro app enables users to schedule work sessions based on the pomodoro technique.

> The Pomodoro technique is a productivity hack. It splits the work time into small segments where each segment is made up of 25 minutes of work and 5 minutes break. By taking small breaks in between 25 short work sessions you can boost your productivity significantly and reduce the risk of being exhausted and unproductive.

---

### Screenshots

<img src="./screenshots/app face.png" width="250">

for other screenshots please refer to the [Screenshots](./screenshots/) folder

---

### Feautres Demonstrated

|                                        Feature                                        | Notes                                                                                                                                           |
| :-----------------------------------------------------------------------------------: | ----------------------------------------------------------------------------------------------------------------------------------------------- |
|         [`Interface API`](https://developer.freshservice.com/docs/interface/)         | Interface API is used to notify users about their session progress                                                                              |
|            [`Data API`](https://developer.freshservice.com/docs/data-api/)            | Data API is used to retrieve the id of the logged-in user                                                                                       |
|      [`SMI`](https://developer.freshservice.com/docs/server-method-invocation/)       | Server Method Invocation is to call the serverless components                                                                                   |
| [`Instance API`](https://developer.freshservice.com/docs/instance-api/#parenttomodal) | Instance API, _specifically the parent to modal using context_ is used to send the user's history to the modal where it is displayed as a chart |
|        [`Data Storage`](https://developer.freshservice.com/docs/data-storage/)        | Various data storage commands are used to store and manipulate the user's data                                                                  |
|    [`Scheduled Events`](https://developer.freshservice.com/docs/scheduled-events/)    | Scheduled events are used to manipulate the user's data                                                                                         |

---

### Prerequisites

1. Trial Freshservice account.
2. A properly configured [Development environment](https://developer.freshservice.com/docs/quick-start/) along with the [FDK (Freshworks Development Kit)](https://developer.freshservice.com/docs/freshworks-cli/).

---

## Procedure to run the app

1. Run the app locally using the [`fdk run`](https://developers.freshservice.com/docs/freshworks-cli/#_run) command.
2. Go to Freshservcie, navigate to the tickets page and select any ticket
3. Refer to the [Test your app](https://developer.freshservice.com/docs/quick-start/) section of the quickstart guide to allow insecure content.
4. Append `?dev=true` to the URL to see the changes

---

### Additional Notes

- If a pomodoro session is stopped midway, the app records it as an interruption. Using this information and the number of sessions the app generates charts by using google charts. App users can self-assess their productivity based on these charts.
- If a page is reloaded or if a user moves to another ticket, the app does not reset the timer.
- To display user history in a chart form, on the app UI click **Show activity**.
- To populate the chart with random data, click **Test data**.
- To clear all user history, click **Clear data**.
