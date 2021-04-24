## Freshteam App Project

On the event of newHireCreate, perform any of the following operations based on the new hire's department:
1. Send welcome mail
2. Create aws account and add to organisation
3. Send invite to BB repo

Select which operations to perform for which department in the custom installation page. 

### Project folder structure explained

    .
    ├── README.md                  This file.
    ├── config
        ├── assets
            ├── iparams.css                     
        ├── iparams.html           Installation parameter config in English language.
        └── iparam_test_data.json  Installation parameter data for local testing.
        ├── oauth_config.json
    └── manifest.json              Project manifest.
    └── server                     Business logic for remote request and event handlers.
        ├── lib
        │   └── handle-response.js
        ├── server.js
        └── test_data
            └── onEmployeeCreate.json
