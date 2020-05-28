# Data storage helper

### Description:
A custom note can be stored for each conversation by the agent. This note can be viewed by any agent has access to the conversation.

This app specifically showcases the usage of encoding helper methods to store any data for the conversations in the data storage.

The length of the conversation_id characters from Freshchat is greater than the key length allowed in Data storage. It will make the job hard to store any data regarding conversations and add any prefix or suffix with the conversation_id further to differentiate the data stored.

To overcome this challenge, the conversation_id is encoded with base85 encoding algorithm to reduce the characters length from 36 to 20. This allows the app to store the any data with conversation_id as the key in the data storage.

This app demonstrates the following features:

1. Data method - It is used to get the conversation from the current page.
2. Data Storage - It is used to store and retrieve a note for the conversations.
3. Interface method - The showNotify method from this method is used to show success and failure notification to the user.

**About buffer library:**
* `Buffer.from('...','hex')` would work fine as long as the input is subjected to certain conditions. For example, it has to be a valid hex and not end in single hex digit.
Conversation ID of Freshchat adheres to Version 4 UUID which fall under this condition.
* Since no bundler is used in this application, a standalone script is loaded as file from `/app/util/buffer.min.js` that is compiled from [Buffer NPM library](https://www.npmjs.com/package/buffer).

### Prerequisites:
1. Make sure you have a Freshchat account created.
2. Ensure that you have the Freshworks Developer Kit (FDK) installed.

### Procedure to run the app:
1. Run the app locally using the [`fdk run`](https://developers.freshchat.com/v2/docs/freshworks-cli/#run) command.
2. Append `?dev=true` to the Freshchat product URL to see the changes.

###### Protip
- Make use of the helper methods shown in this app to store any data for the conversations
