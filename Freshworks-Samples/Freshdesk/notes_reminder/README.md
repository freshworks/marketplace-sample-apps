# Notes Reminder App

### Description:
You can add a note and set a reminder so that app will remind your note after a set period of time as scheduled.

Features demonstrated | Notes
-------------------- | ------
App location: ticket_sidebar | You can use same location for Freshdesk as well
Server Method Invocation | "Remind me" button directly executes createSchedule method in server.js
db | Sheduled event stores and retrives notes via db platform feature
Interface API | Notifications are powered with this api

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

_[Screenshots that are not too big/small. Gifs are best. Let's just stick to 3 screenshots at the max]_

###### Protip
- The Scheduled Events feature demonstrated here can only be really tested by uploading it as custom app.
- In local testing, the app runs the Scheduled code irrespective of the time actually scheduled.
- This app when stores the data in db. You can find db in local testing under .fdk/localstore file.
