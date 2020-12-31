# Cataloging using Custom Entities

### Description:

A Super simple Catalog manager built using Custom Entities powered by the Freshworks Developer Platform

### Screenshots:

![](https://user-images.githubusercontent.com/19341550/99782175-d36c7800-2b3e-11eb-9af4-463c943d5427.png)

Features demonstrated | Notes
----------------------|-----------------------------------------------------------
Custom Entities       | Uses it to create domain-specific custom objects & records

### Pre-requisites:
1. Make sure you have a trial [Freshdesk] account created. 
2. Ensure that you have the latest version of the Freshworks Developer Kit (FDK) installed properly.
3. (For early access) Custom Entities might already be available for users who are part of the EAP. If you are interested please [feel free to request access here](https://community.developers.freshworks.com/t/announcing-early-access-program-custom-objects/1509)


### Procedure to run the app:
1. Run the app locally using the [`fdk run`](https://developers.freshchat.com/v2/docs/freshworks-cli/#run) command
2. Fill the iparams using http://localhost:10001/custom_configs
3. Append `?dev=true` to the Freshdesk product URL to see the changes. The will appear as a calendar icon in the sidebar
4. You create restaurants by clicking on the `+` button and schedule appointments by clicking on a particular time-slot in the calendar

