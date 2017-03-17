## My First App

This app shows the Freshdesk logo and the name of the ticket requester or contact.

This app demonstrates the following features
1. Using domHelper to get requester and contact details
2. Loading an image from the assets folder

### Project folder structure explained

    .
    ├── README.md                 This file.
    ├── app                       Source code of the app.
    │   └── template.html         HTML for the app.
    |   └── app.js                Business logic for the app.
    |   └── style.scss            Style information for the app.
    ├── assets                    Store assets such as CSS, JS and images.
    │   └── logo.png
    ├── config                    Installation parameter configuration directory.
    │   ├── iparam_en.yml         Installation parameter config in English language.
    │   └── iparam_test_data.yml  Installation parameter data used for local testing.
    └── manifest.yml              App manifest.
