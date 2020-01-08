# An Unexpected Journey

"The Anatomy of an App - The Front-end App"

## What does the app do ?

1. The app loads in the ticket background.
2. App checks if the current logged in agent is **Mr.Baggins** and shows the relavant notifications.
3. Makes an api call searching "an unexpected journey" on themoviedb.org and displays it's overview in a notification.

Feature demonstrated | Notes
-------------------- | ------
App Location: ticket_background |
Interface API | Disables ticket properties
Event API | Listens for a change event on the page
Request API | To fetch data from themoviedb API endpoint

Capability Demonstrated | Leveragable Potential
----------------------- | ---------------------
Demonstrates ticket background app location applicable for Freshdesk & Freshservice | Freshchat, Freshsales, Freshcaller can also demonstrate same with respective App locations.
As Freshdesk app, it gets logged in 'user' with Data API | For Freshservice app, you can get logged in 'agent' to check for Mr.Baggins

###### Pro Tip
- The platform features that you use to build using FDK is compatible with any Freshworks product with very less differences.
