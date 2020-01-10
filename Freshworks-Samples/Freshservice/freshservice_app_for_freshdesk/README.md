# Freshservice App for Freshdesk

### Description:
Easily transfer customer support issues into your servicedesk that needs attention by the internal teams such as devs, process owners, admins etc.

### Screenshots:

_[Screenshots that are not too big/small. Gifs are best. Let's just stick to 3 screenshots at the max]_

Features demonstrated | Notes
-------------------- | ------
 _Feature Name_ | _How the app is using it_

### Prerequisites:
1. Make sure you have a trial [FreshworksProduct] account created
2. Ensure that you have the Freshworks Developer Kit (FDK) installed properly.

_[From point 3, add some of the important prerequisites which are specific to this app]_

### Procedure to run the app:
1. Fill the `iparam_test_data.json` before running the app locally.
2. Run the app locally using the [`fdk run`](https://developers.freshchat.com/v2/docs/freshworks-cli/#run) command
3. Append `?dev=true` to the Freshworks product URL to see the changes

### Additional Comments
Consider a use case where Acme corp uses Freshdesk as its customer support solution and Freshservice to manage their IT, build and change process. On any day, Acme corp manages hundreds to thousands of customer interactions on Freshdesk. There might be some complaints that needs assistance from the internal dev teams or might result in changes, especially if a bug a found. Considering the internal teams of Acme reside in Freshservice, the entire context of the issue should be sent to Freshservice so that concerned team can work on the same. Additionally, any updates from the internal teams should be communicated to the customer support teams.

Tickets from Freshdesk will be sent over to Freshservice on create or update, whenever the conditions defined in the Freshservice App for Freshdesk are met.
