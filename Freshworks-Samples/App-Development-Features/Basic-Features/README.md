Feature | Description
------- | -----------
App Cycle Events | For an app to refresh its data at the right time, the parent application will emit an app.activated() event. The event timing differs depending on the app’s location. The app should register to listen for an app.activated event when the page containing the app is loaded for the first time, which is denoted by the app.initialized() event.
Data APIs | You can use these APIs to retrieve information about different objects on a page.
Event APIs | Event APIs enable you to react to events that occur in the user interface of a page. This includes button clicks, changes, and updates to field values. You can register event listeners which are invoked when an event occurs. Some events can be intercepted and the app can decide to allow or prevent the event from completing.
Interface APIs | You can use Interface APIs to trigger user interface actions on a page. With these APIs, an app can control the visibility of ticket properties, hide or disable buttons, and show dialog boxes and notifications.
