# [Onboard Employees]

### Description:

_Freshteam app to onboard new employees to various Freshworks products_

### Features:

Features demonstrated | Notes
-------------------- | ------
 onEmployeeCreate event | _The app onboards the employees to domains when an employee is created_

### Prerequisites:
1. Make sure you have a trial ```Freshdesk```,```Freshservice```, ```Freshteam``` accounts created
2. Ensure that you have the Freshworks Developer Kit (FDK) installed properly.

### Procedure to run the app:
1. Fill the `iparams page` before running the app locally using `/custom_configs` page.
2. Run the app locally using the [`fdk run`](https://developers.freshteam.com/docs/freshworks-cli/#run) command
3. Use `web/events` page to test your serverless app
4. Simulate `onEmployeeCreate` event
