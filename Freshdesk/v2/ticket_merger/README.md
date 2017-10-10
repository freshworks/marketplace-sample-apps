## Freshdesk App Project

Congratulations on creating your App Project! Feel free to replace this text with your project description.

### Project folder structure explained

    .
    ├── .gitignore              In case you decide to version this code with Git.
    ├── README.md               This file.
    ├── app                     Source code of the app.
    │   └── template.liquid     HTML for the app.
    |   └── app.js              Business logic for the app.
    |   └── server.js           Business logic for remote request and event handlers.
    |   └── style.scss          Styles for the app.
    ├── assets                  Store all project assets like CSS, JS and images.
    │   └── logo.png
    ├── config                  Installation parameter configs.
    │   ├── iparam_en.yml       Installation parameter config in English language.
    │   └── iparam_test_data.yml       Installation parameter data for local testing.
    └── manifest.yml            Project manifest.

More details on the structure and files:

1. Unsupported files inside `assets/` will not be packaged. Supported file extensions include: `.jpg`, `.png`, `.gif`, `.css` and `.js`.
2. `iparam_en.yml` has commented sample configuration. `_en` in the configuration refers to English language. If you need to support installation-configuration in multiple languages, say Italian in addition to English, you need to have a `iparam_it.yml` configuration. English is the default fallback language.
3. `iparam_test_data.yml` is the installation parameter that is used in Local Testing.
