##  Sample App to demonstrate Authentication 
This is sample app to demonstrate Freshchat authentication. It authenticates the user and displays the list of all agents configured by the business that uses Freshchat.

### Prerequisites
   1. Make sure you have a Freshchat account and ensure that it is activated.
   2. Make sure you have the development environment setup with the latest version of [ Freshworks Developer Kit](https://developers.freshchat.com/v2/docs/quick-start/#install_the_cli) (FDK). To know more visit [developers](https://developers.freshchat.com/) site.

### Steps to run and view the App
   1. After setting up the environment, navigate to the `/authentication-demonstration` folder and execute `fdk run` command. It starts its execution and  runs locally at `http://*:10001`. If you are having any issues refer this [link](https://developers.freshdesk.com/v2/docs/quick-start/#test_your_app).
   2. Go to settings in the freshchat and click on api tokens option available under configure settings. click on generate token to generate freshchat api key, if the api key already exists then copy it. 
   3. Then go to `http://*:10001/custom_configs` , paste the api key and click install.
   4. Open your freshchat account and open any conversation from your inbox. Append `?dev=true` in the url to trigger and view the running app inside freshchat.
   5. Running app will be displayed in the user info tab and you can view the list of all agents by clicking on the view all agents button 👍🏻. 
 

### Folder structure explained

    .
    ├── README.md                  This file.
    ├── app                        Contains the files that are required for the front end component of the app.
    │   ├── app.js                 Entry point of the application which contains logic to authentication and fetch the agents data.
    │   ├── dialog.js              Manipulates the fetched data and generates a table format for the data.
    │   ├── icon.svg               Sidebar icon SVG file. Should have a resolution of 64x64px.
    │   ├── freshchat_logo.png     The Freshchat logo that is displayed in the app.
    │   ├── error.png              Displayed when error occurs.
    │   ├── style.css              Style sheet for the app.
    │   ├── template.html          Contains the HTML required for the app’s UI.
    │   ├── dialog.html            Contains the HTML required for dialog box.
    ├── config                     Contains the installation parameters.
    │   ├── iparams.json           Contains the parameters that will be collected during installation.
    │   └── iparam_test_data.json  Contains sample Iparam values that will used during testing.
    └── manifest.json              Contains app meta data and configuration information.
