# Ticket Merger

### Description:

Merges Tickets created by the same requester within a configurable time window. Also adds useful notes on the tickets mentioning the ticket to/from which the merge was done. Requires the Freshdesk API key to make the necessary API calls to add notes, close tickets etc.

### Screenshots:

![](screenshots/simulation.gif)

Features demonstrated | Notes
-------------------- | ------
 onTicketCreate Product Event | NA
 Request API | Making an API calls to Freshdesk using proper Authentication and Authorization.
 db | Data Persistence to keep track of ticket create events.

### Prerequisites:
1. Make sure you have a trial [FreshworksProduct] account created
2. Ensure that you have the Freshworks Developer Kit (FDK) installed properly.

_[From point 3, add some of the important prerequisites which are specific to this app]_

### Procedure to run the app:
1. Fill the `iparam_test_data.json` before running the app locally.
2. Run the app locally using the [`fdk run`](https://developers.freshchat.com/v2/docs/freshworks-cli/#run) command
3. Append `?dev=true` to the Freshworks product URL to see the changes

_[ Special instructions for realizing the value out of this app]_
