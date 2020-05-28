# An Unexpected Journey

### Description:
1. The app loads in the ticket background.
2. App checks if the current logged in agent is **Mr.Baggins** and shows the relavant notifications.
3. Makes an api call searching "an unexpected journey" on themoviedb.org and displays it's overview in a notification.

Feature demonstrated | Notes
-------------------- | ------
App Location: ticket_background | NA
Interface API | Disables ticket properties
Event API | Listens for a change event on the page
Request API | To fetch data from themoviedb API endpoint

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

###### Pro Tip
- The platform features that you use to build using FDK is compatible with any Freshworks product with very less differences.
