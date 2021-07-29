# Custom Installation Page App

### Description:

_This app Appreciates the agents on their milestones like the messages milestones(when they cross an amount of messages like 50,100 etc). Also this app shows an appreciation message on agent resolving the conversation.It makes use of `conversation_background` to run the app in the background of conversation. `Interface_method` to push notification and open the dialog. `Data method` to fetch data from freshchat and `Events method` to trigger the events on actions such as `onResolveClick`_

### Screenshots:

![](screenshots/appView.png)

| Features demonstrated                                                               | Notes                                                                                 |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| _(conversation background)[https://developers.freshchat.com/v2/docs/placeholders/]_ | _To run the app in background of the conversation_                                    |
| _(Iterface method)[https://developers.freshchat.com/v2/docs/interface-method/]_     | _It is used to push notification and show dialog in this app_                         |
| _Data method_                                                                       | _You can use these APIs to retrieve information about different objects on a page._   |
| _Events method_                                                                     | _Event APIs enable you to react to events that occur in the user interface of a page_ |

### Prerequisites:

1. Make sure you have a trial _Freshchat_ account created
2. Ensure that you have the Freshworks Developer Kit (FDK) installed properly.

### Procedure to run the app:

1. Run the app locally using the [`fdk run`](https://developers.freshchat.com/v2/docs/freshworks-cli/#run) command
2. Append `?dev=true` to the Freshworks product URL to see the changes
