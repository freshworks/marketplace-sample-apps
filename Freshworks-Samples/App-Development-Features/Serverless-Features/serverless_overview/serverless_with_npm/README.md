# Serverless with NPM

## Description

Serverless app to demonstrate usage of npm package in app.

---

## Features Demonstrated

|                                   Feature                                   | Notes                                                                                                                                                                                                                    |
| :-------------------------------------------------------------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`Product Events`](https://developers.freshdesk.com/v2/docs/product-events) | The [_onTicketCreate_](https://developers.freshdesk.com/v2/docs/product-events/#onticketcreate) product event has been used to trigger the serverless app which works with _lodash_ npm package and logs a sample output |

---

## Prerequisites

1. Make sure you have a trial Freshdesk account created.
2. A properly configured [Development environment](https://developers.freshdesk.com/v2/docs/quick-start/) along with the [FDK (Freshworks Development Kit)](https://developers.freshdesk.com/v2/docs/freshworks-cli/).

---

## Procedure to run the app

1. Run the app locally using the [`fdk run`](https://developers.freshdesk.com/v2/docs/freshworks-cli/#run) command.
2. Go to Freshdesk, navigate to the tickets page and create a new ticket.
