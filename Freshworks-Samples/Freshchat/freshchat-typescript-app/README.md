## Typescript Sample App for Freshchat

This is a sample app created using Typescript.
It takes a webhook url as input in iparams.json.
On every app event, it makes a POST request to the configured webhook url.

### Prerequisites

1. Make sure you have a Freshchat account created.
1. Ensure you have the [Freshworks Developer Kit (FDK)](https://developers.freshchat.com/v2/docs/quick-start/#install_the_cli) installed.

### Procedure to run the App

Run the following commands:
- `yarn install` will install all the dependencies in `package.json`.
- `yarn watch` will run Typescript compile on all the Typescript files mentioned in `tsconfig.json`. This will throw some errors, but will vanish once the next command is run.
- `fdk run` on a separete window will install all dependencies in `manifest.json` and serves the app locally.

Any changes you make to the `.ts` files will automatically trigger a typescript compile and will be served locally.

### Project folder structure explained

    .
    ├── README.md                   This file.
    ├── config                      Installation parameter configs.
    │   ├── iparams.json            Installation parameter config in English language.
    └── manifest.json               Project manifest.
    ├── server                      Business logic for remote request and event handlers.
    │   └── server
    │       ├── interfaces          Typescript interfaces
    │       │   ├── EventPayload.ts Typescript interfaces for event payloads
    │       │   └── Marketplace.ts  Typescript interfaces for marketplace APIs
    │       └── server.ts           Serverless events entry point
    ├── .eslintignore
    ├── .eslintrc.js
    ├── .gitignore
    ├── .prettierrc.json
    ├── tsconfig.json               Typescript configuration file
    ├── package.json
    └── yarn.lock
