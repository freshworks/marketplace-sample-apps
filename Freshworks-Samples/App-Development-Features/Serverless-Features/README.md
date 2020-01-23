Feature | Description
------- | -----------
Serverless Overview | The Freshworks app development platform includes a serverless environment to enable you to create apps that run in response to events such as Freshdesk product, app setup, and external events. Serverless computing involves servers, but they are abstracted away from developers.
Product Events | These are events, such as ticket create,onEmployeeCreate, onEmployeeUpdate, and onNewHireCreate, contact create, deal update, lead create ticket update, and conversation create, which can trigger apps. When product events occur, the appropriate method in the server.js file is invoked.
App Setup Events | The app setup events are synchronous, which means that the callback method for the event can decide whether to allow or disallow the completion of the event
External Events | Apps can be invoked in response to events that occur in an external product or service by creating webhooks in that product or service.
Scheduled Events | You can create one-time or recurring scheduled events to invoke serverless apps. At the specified time, the App Framework is notified which then invokes the relevant serverless method in the app.
Server Method Invocation | The Server Method Invocation (SMI) feature allows the front-end component of an app to invoke the serverless component. 
