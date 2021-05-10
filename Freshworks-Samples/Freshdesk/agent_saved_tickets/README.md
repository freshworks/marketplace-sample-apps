## Freshdesk Agent Tickets App

This app allows an agent to save tickets to look at later. 

App Demo 

![App Demo](demo.gif)

### Things I used in this app
* App lifecycle methods
* Data methods
* Serverless app
* Data Storage
* Request Method
* Instance Method
* Server Method Invocation


### Few problems
* The ticket link could be opened in new window (to provide better UX), but it fails with below error
    ```
    Unsafe attempt to initiate navigation for frame with origin 'https://newaccount1619511084587.freshdesk.com' from frame with URL 'http://localhost:10001/iframe/index.html?appId=123456789'. The frame attempting navigation of the top-level window is sandboxed, but the flag of 'allow-top-navigation' or 'allow-top-navigation-by-user-activation' is not set.
    ```
  so for now, I'm opening tickets in a new tab.
* As of now, app widget cannot be resized. So the column "remove ticket" looks bit weird.  
