
# CRM Leads Lookup

## Description
This is a Freshdesk app that loads in contacts from a CRM (freshsales) via REST APIs and shows it up in a Modal. Additially, app also allows to persist lead information in platform db.


## Prerequisites

1. A trial Freshdesk account and API Key from Freshsales CRM.
2. A properly configured [Development environment](https://developer.freshservice.com/docs/quick-start/) along with the [FDK (Freshworks Development Kit)](https://developer.freshservice.com/docs/freshworks-cli/)

***

## Procedure to run the app

1. Run the app locally using the [`fdk run`](https://developer.freshservice.com/docs/freshworks-cli/#_run) command.
2. Go to Freshdesk, navigate to the tickets page and select any ticket
3. Refer to the [Test your app](hhttps://developer.freshservice.com/docs/quick-start/#test_your_app) section of the quickstart guide to allow insecure content.
4. Append `?dev=true` to the URL to see the changes

***

## Additional Notes
- This app when stores the data in db. You can find db in local testing under .fdk/localstore file.
