# Freshdesk App for Freshservice

## Description

Easily transfer customer support issues into your servicedesk that needs attention by the internal teams such as devs, process owners, admins etc.

 Consider a use case where Acme corp uses Freshdesk as its customer support solution and Freshservice to manage their IT, build and change process. On any day, Acme corp manages hundreds to thousands of customer interactions on Freshdesk. There might be some complaints that needs assistance from the internal dev teams or might result in changes, especially if a bug a found. Considering the internal teams of Acme reside in Freshservice, the entire context of the issue should be sent to Freshservice so that concerned team can work on the same. Additionally, any updates from the internal teams should be communicated to the customer support teams.

***

### Screenshots

<img src="./screenshots/Iparams.png">

***

## Features Demonstrated

App type: [Serverless](https://developer.freshservice.com/docs/overview/)

Feature | Notes
| :---: | --- |
| [`Request API`](https://developer.freshservice.com/docs/request-api/) | request APIs have been used to send data between freshdesk and freshservice  |
| [`Product Events`](https://developer.freshservice.com/docs/product-events/) | Product events namely  _onTicketUpdate_  and _onConversationCreate_ has been used to trigger serverless component exchange data between freshdesk and freshservice |

***

## Prerequisites

1. Make sure you have  Freshservice, Freshdesk trial accounts created.
2. Note down their API keys for reference.
3. Ensure that your [Development environment](https://developer.freshservice.com/docs/quick-start/) along with the [FDK (Freshworks Development Kit)](https://developer.freshservice.com/docs/freshworks-cli/) is set up and configured properly.

***

## Procedure to run the app

1. Run the app locally using the [`fdk run`](https://developers.freshservice.com/docs/freshworks-cli/#_run) command.
2. visit `http://localhost:10001/custom_configs/` in your browser to 
view installation page.
3. Enter the API keys and the subdomains of your freshdesk and freshservice trial accounts.
4. Click authenticate and follow the on screen instructions.
5. After configuration click install button to finish installation.
6. Go to Freshservice, navigate to the tickets page and select any ticket.
7. Refer to the [Test your app](https://developer.freshservice.com/docs/quick-start/) section of the quickstart guide to allow insecure content.
8. Append `?dev=true` in the URL to run the app.
