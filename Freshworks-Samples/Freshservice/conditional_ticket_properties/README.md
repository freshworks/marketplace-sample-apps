# Conditional ticket properties

### Description:

 The Conditional ticket properties app lets admin hide the default type field from the ticket details page. Additionally, based on the ticket priority chosen, admin is able to hide the close button, restricting the edition of due date, disable type, group, impact ticket properties & as well add a default private note. This app also hides the urgency and impact properties if the logged in agent is from the HR group.

### Screenshots:

_[Screenshots that are not too big/small. Gifs are best. Let's just stick to 3 screenshots at the max]_

### Features demonstrated:
  1. Rendering apps on Ticket details page (background location)
  2. Usage of Global data APIs
  3. Usage of Events and Interface APIs on ticket details page

### Prerequisites:
1. Make sure you have a trial [FreshworksProduct] account created
2. Ensure that you have the Freshworks Developer Kit (FDK) installed properly.

_[From point 3, add some of the important prerequisites which are specific to this app]_

### Procedure to run the app:
1. Fill the `iparam_test_data.json` before running the app locally.
2. Run the app locally using the [`fdk run`](https://developers.freshchat.com/v2/docs/freshworks-cli/#run) command
3. Append `?dev=true` to the Freshworks product URL to see the changes
