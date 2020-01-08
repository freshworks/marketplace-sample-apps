# Scheduled events
You can add a note and set a reminder so that app will remind your note after a set period of time as scheduled.

###### Protip
- The Scheduled Events feature demonstrated here can only be really tested by uploading it as custom app.
- In local testing, the app runs the Scheduled code irrespective of the time actually scheduled.
- This app when stores the data in db. You can find db in local testing under .fdk/localstore file.

Features demonstrated | Notes
-------------------- | ------
App location: ticket_sidebar | You can use same location for Freshdesk as well
Server Method Invocation | "Remind me" button directly executes createSchedule method in server.js
db | Sheduled event stores and retrives notes via db platform feature
Interface API | Notifications are powered with this api
