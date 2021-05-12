## Freshteam Newhire-Onboarding-Invites

This app assumes the host Freshworks product to be Freshteam, an employee engagement software.

The app observes if new hire has been added and does the following operations:

1. Sends a welcome email on new hire's official email address.
2. Creates an AWS account and adds to Organisation.
3. Sends an invite to a configured BitBucket Repository.

The app can be configured to perform any of the 3 operations for each department. This can be done during the installation of the app, and also can be changed later. 

Features demonstrated | Notes
-------------------- | ------
 _SendGrid Mail_ | _App sends a welcome mail whenever there's a new hire using sendgrid API, version 7.4.2_
 _AWS Create Account_ | _App creates AWS account for the new hire using AWS SDK version 2.879.0_
  _BitBucket Invitation_ | _App invites the new hire to a configured Bitbucket repository_

### Prerequisites :
1. Make sure you have a trial Freshteam account created
2. Ensure that you have the Freshworks Developer Kit (FDK) installed properly.
3. Ensure that an account in Twilio SendGrid has been created and you have the API key for the same. 
4. Create an IAM user in AWS to get the [`access and Secret access IDs`](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html)
5. Create a [`consumer`](https://support.atlassian.com/bitbucket-cloud/docs/use-oauth-on-bitbucket-cloud/) in Bitbucket to get the client and secret keys. 

### Procedure to run the app:
1. Run the app locally using the [`fdk run`](https://developers.freshteam.com/docs/freshworks-cli/#run) command
2. Set the installation parameters in the custom installation page.
3. Choose `onNewHireCreate` event in the events page.

### Procedure for end-to-end testing:
1. Run the app locally using the [`fdk run`](https://developers.freshchat.com/v2/docs/freshworks-cli/#run) command
2. Go to your Freshteam account's `App Gallery`
3. Set the installation parameters in the custom installation page. 
    _To trigger the onNewHireCreate event:_
    4. Go to a job posting in the recruit page of your Freshteam account. 
    5. Add a candidate and draft offer.
    6. Change the candidate's status from "Offered" to "Offer Accepted". Now the candidate is converted to a New Hire and you will be able to see the candidate in the `Onboarding` page. 
