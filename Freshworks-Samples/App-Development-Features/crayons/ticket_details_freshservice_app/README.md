## Your First App

Congratulations on creating your first app! Feel free to replace this text with your app's actual description.

### Folder structure explained

    .
    ├── README.md                  This file
    ├── app                        Contains the files that are required for the front end component of the app
    │   ├── app.js                 JS to render the dynamic portions of the app
    │   ├── icon.svg               Sidebar icon SVG file. Should have a resolution of 64x64px.
    │   ├── freshservice_logo.png  The Freshservice logo that is displayed in the app
    │   ├── style.css              Style sheet for the app
    │   ├── template.html          Contains the HTML required for the app’s UI
    ├── config                     Contains the installation parameters and OAuth configuration
    │   ├── iparams.json           Contains the parameters that will be collected during installation
    │   └── iparam_test_data.json  Contains sample Iparam values that will used during testing
    └── manifest.json              Contains app meta data and configuration information
