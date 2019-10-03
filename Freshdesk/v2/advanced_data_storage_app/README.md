## Advanced Data Storage App

This app allows you to set aliases for links similar to URL shortner services such as bit.ly.
The links can be fetched with the set alias. But, it is stored only for a day time in the data storage just like Instagram story and WhatsApp status. ;)
This app can be used to share a secret with peer support agents without actually sending the link but the alias of the link.

### Features demonstrated

1. Data Storage - Set, Update and Increment the data stored.
2. Data Storage - Set TTL (Time-To-Live) for key-value pairs.
3. Interface API - Show notifications, Open up Modals
4. Instance API - Send and Receive data between Modals and the parent template

### Steps to run the app

1. Clone the repository and navigate to Freshdesk/v2/advanced_data_storage_app
2. Execute **_fdk run_** on the folder
3. Visit **_https://domain.freshdesk.com/a/tickets/123?dev=true_** in the browser to see the app loading in the ticket details page sidebar. In the specified URL, the **_domain_** should be replaced by your domain and **_123_** should be replaced by the ticket ID of available ticket in your Freshdesk instance
