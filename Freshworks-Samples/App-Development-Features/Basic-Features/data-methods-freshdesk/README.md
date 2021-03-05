# Data Methods for freshdesk

### Description:

Data Methods allow your app to access information on a given Freshdesk page. In this tutorial you’ll learn how to consume data methods in your freshworks apps.

`client.data.get("<argument>")` returns a promise where your callback would have access data in the page which user is currently viewing.

### Screenshots:

### Displaying Requester Data

![config page in local development](./screenshots/data%20methods%20-%20fullpage.png)

#### Displaying Contact Data

![make secure api calls and get api data](./screenshots/data%20methods%20-%20sidebar.png)

| Features demonstrated | Notes                                       |
| --------------------- | ------------------------------------------- |
| Data Methods          | Simply writes the information fetched to UI |

### Prerequisites:

1. Make sure you have a trial Freshdesk account created. You can always [sign up](https://freshdesk.com/signup)
2. Ensure that you have the [Freshworks CLI](https://community.developers.freshworks.com/t/what-are-the-prerequisites-to-install-the-freshworks-cli/234) installed properly.
3. Get [Freshdesk API key](https://support.freshdesk.com/support/solutions/articles/215517). After you install the app, you'd notice contacts are being rendered in `ticket_conversation_editor` placeholder.

### Procedure to run the app:

```sh
# Run the app
> fdk run
# app runs on localhost:10001 and sample config page is rendered on /custom_configs
```
