# Advanced Data Storage App

### Description:

This app allows you to set aliases for links similar to URL shortner services such as bit.ly.
The links can be fetched with the set alias. But, it is stored only for a day time in the data storage just like Instagram story and WhatsApp status. ;)
This app can be used to share a secret with peer support agents without actually sending the link but the alias of the link.

### Screenshots:

_[Screenshots that are not too big/small. Gifs are best. Let's just stick to 3 screenshots at the max]_

### Features demonstrated

1. [Data Storage](https://developer.freshdesk.com/v2/docs/data-storage/) - Set, Update and Increment the data stored.
2. [Data Storage](https://developer.freshdesk.com/v2/docs/data-storage/) - Set TTL (Time-To-Live) for key-value pairs.
3. [Interface API](https://developer.freshdesk.com/v2/docs/interface-api/) - Show notifications, Open up Modals
4. [Instance API](https://developer.freshdesk.com/v2/docs/instance-api/) - Send and Receive data between Modals and the parent template

### Steps to run the app

1. Clone the repository and navigate to Freshdesk/v2/advanced_data_storage_app
2. Execute **_fdk run_** on the folder
3. Visit **_https://domain.freshdesk.com/a/tickets/123?dev=true_** in the browser to see the app loading in the ticket details page sidebar. In the specified URL, the **_domain_** should be replaced by your domain and **_123_** should be replaced by the ticket ID of available ticket in your Freshdesk instance

### Prerequisites:
1. Make sure you have a trial [FreshworksProduct] account created
2. Ensure that you have the Freshworks Developer Kit (FDK) installed properly.

_[From point 3, add some of the important prerequisites which are specific to this app]_
