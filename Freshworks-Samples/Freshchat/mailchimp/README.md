# Mailchimp Sample App for Freshchat

### Description:

When the 'email' for a user is added/updated, you can directly add them to Mailchimp from Freshchat

### Screenshots:

![Screenshot](app/demo.png)

| Features demonstrated | Notes                     |
| --------------------- | ------------------------- |
| _Feature Name_        | _How the app is using it_ |

### Prerequisites:

1. Make sure you have the development environment setup with the latest version of FDK. If you are starting from scratch, You can have a look at the [quick start](https://developers.freshchat.com/v2/docs/quick-start/) mentioned here. Skip this step if you already have the FDK installed

2. Create a test Mailchimp account and provide the required details for the installation parameters. Use `config/iparam_test_data.json` for [local testing](https://developers.freshchat.com/v2/docs/quick-start/#test_your_app).

### Procedure to run the app:

1. Run the app locally using the [`fdk run`](https://developers.freshchat.com/v2/docs/freshworks-cli/#run) command

2. Edit or add email to a user from the Freshchat conversation inbox page

3. This would trigger a confirmation dialog that lets you save the user to Mailchimp

4. Choose Add/skip accordingly
