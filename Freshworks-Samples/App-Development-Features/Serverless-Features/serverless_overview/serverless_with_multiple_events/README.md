# Serverless with multiple events

## Description

Serverless app to demonstrate usage of multiple types of events (product event, app setup event and external event).

---

## Features Demonstrated

|                                   Feature                                   | Notes                                                                                                                                                 |
| :-------------------------------------------------------------------------: | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`Product Events`](https://developers.freshdesk.com/v2/docs/product-events) | Various product events such as _onTicketCreate_, _onAppInstall_, _onExternalEvent_ and _onAppUninstall_ registration at the same time is demonstrated |

---

## Prerequisites

1. Make sure you have a trial Freshdesk account created.
2. A properly configured [Development environment](https://developers.freshdesk.com/v2/docs/quick-start/) along with the [FDK (Freshworks Development Kit)](https://developers.freshdesk.com/v2/docs/freshworks-cli/).

---

## Procedure to run the app

1. Run the app locally using the [`fdk run`](https://developers.freshdesk.com/v2/docs/freshworks-cli/#run) command.
2. to run the _onTicketCreate_ event, go to Freshdesk, navigate to the tickets page and create a new ticket.
