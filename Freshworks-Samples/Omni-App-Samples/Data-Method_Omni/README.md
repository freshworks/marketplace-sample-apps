# Data Method
#### For Omni App Implementation

### Description:
Your app 🛫  may want to make API calls. When it is to the same product on which app is running, Data Method will give you Domain and Product URL to which your consume REST APIs.

### Screenshots:

↕ Coming Soon

Features demonstrated | Notes
-------------------- | ------
 `client.data.get('domainName').then(function(data){},function(error){}) `| Usage of this feature for the app to make right API calls to the Right products.


### Prerequisites:
1. Make sure you have a trial account of Freshsales and Freshworks CRM.
2. Make sure you have App development [environment setup](https://community.developers.freshworks.com/t/what-are-the-prerequisites-to-install-the-freshworks-cli/234).

### Procedure to run the app:
1. You can locally test your Omni App only one Product at a time. For example, if you want to test your app on Freshworks CRM, you will have to mention the `"freshworks_crm"` product attribute first in your `manifest.json` and vice versa.
2. Open Deal Details page. In the bottom viewport you will see your app running.
