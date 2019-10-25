
# Freshworks Sample Apps

Sample Apps in this repository demonstrate features of our developer platform. Any app that you build will be run as part of the in-product experience. Join us in crafting those experiences.

>The App development for any Freshworks product follows a common pattern. Which implies once an app built for one product will be similar to another with very few changes required.

## Inital Steps
1. [Quickstart](https://developers.freshdesk.com/v2/docs/quick-start/#create_your_first_app) buidling an app for any product as they follow a common pattern.
2. See [these 7 steps introducing](https://freshhuddle.github.io/codelabs/fh0/index.html?index=..%2F..index#6) you freshworks developer platform.
3. Build your [first advanced app](https://freshhuddle.github.io/codelabs/fh1/index.html?index=..%2F..index#1).
4. Bonus! [Unleash the power of serverless apps](https://freshhuddle.github.io/codelabs/fh3/index.html?index=..%2F..index#0).

###### Setting up environment
1. Install NVM
   - Instructions [for Mac](https://github.com/creationix/nvm#installation-and-update)
   - For Windows:
     - [Download](https://github.com/coreybutler/nvm-windows/releases)
     - Extract the installer from _nvm-setup.zip_ listed under Assets.
2. [Install Node 8.10](https://developers.freshdesk.com/v2/docs/quick-start/#install_nvm)
3. Install [command line tool - FDK](https://developers.freshdesk.com/v2/docs/quick-start/#install_the_cli)

###### Overall references
Products| App SDK | API | Description
---------|---------|-----|-----------|
 [Freshdesk](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshdesk/v2) | [Documentation](https://developers.freshdesk.com/) | [Reference](https://developers.freshdesk.com/api/)| Customer Support Software
 [Freshservice](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshservice) | [Documentation](https://developers.freshservice.com/) | [Reference](http://api.freshservice.com/v2/) | IT service management software
 [Freshchat](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshchat) | [App Quickstart](https://developers.freshchat.com/v2/docs/quick-start/) | [Web SDK](https://developers.freshchat.com/web-sdk/) | Customer messaging software
 [Freshsales](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshsales) | [Documentation](https://developers.freshsales.io/docs/quick-start/) | [Reference](https://www.freshsales.io/api/) | Sales CRM software
 Freshcaller | Coming soon| Coming soon | Call center software

 ## Sample Apps by Platform features

Platform feature | Sample code | Notes
---------------- | ----------- | -----|
App Manifest | Common Available | [The manifest file](https://developers.freshdesk.com/v2/docs/app-manifest/) will allow the same app on different products(if compatible) by just updating name in this file.
App location | Commonly available | App locations differs across product - [Freshdesk](https://developers.freshdesk.com/v2/docs/app-locations/) / [Freshsales](https://developers.freshsales.io/docs/app-locations/) / [Freshchat placeholder](https://developers.freshchat.com/v2/docs/placeholders/) / [Freshservice](https://developers.freshservice.com/docs/app-locations/)
[Installation Parameters](https://medium.com/freshworks-developer-blog/securing-sensitive-installation-parameters-3879908ade17) | [Sentimental Jeff App](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshdesk/v2/sentimental_jeff_app/config), [Github workflow actions](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshservice/github_workflow_actions/config) | Common pattern across all products
[Custom Installation Page](https://medium.com/freshworks-developer-blog/updates-to-the-custom-installation-page-b787b66c8a39) | [Custom Installation page demo App](https://github.com/freshdesk/marketplace-sample-apps/tree/master/Freshdesk/v2/custom_installation_page_app) | NaN
[Data API]()||
Events API||
Interface API ||
Data Storage ||
Request API ||
OAuth 2||
