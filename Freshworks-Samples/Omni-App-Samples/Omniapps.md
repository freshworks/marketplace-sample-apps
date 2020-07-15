# Omni App Samples
We are rolling out a new type of implementation for the Freshworks app developers and calling this type of implementation as Omni Apps

### What are Omni Apps?
Wondered if you can write app once, and run across mulitple Freshworks products'? This is coming true.

Omni Apps are a way, were App developers can now write their app once and run across mulitple products'.

> As of July 2020, App developers can build Omni app that can run on Freshsales and Freshworks CRM. So in the following samples we will also use Omni App that supports Freshsales and Freshworks CRM.

### What can I find here?
You will find 4 sample app codes without specific use case entirely focussing on following platform features:

  #### Custom Installation Page for Omni apps
  In this sample app, code will explain you the usage of Custom Installation Page in an Omni App. For example, if your app user is installs your app in Freshworks CRM product, how do you make sure Installation page experience is Freshworks CRM oriented and not Freshsales?

  #### Data Method
  Let's say, your app want's to make REST API calls. How will the app know if it needs to make calls to Freshsales or Freshworks CRM? How will app programatically recognize it? Data method is one of the platform feature that can give your app that information.

  We will see the code on this more.

  #### Installation Parameters
Your app mignt need to capture some information from the user upfront before app is being installed. At the same time, your requirement to capture those details are simple that you don't want to waste time around writing HTML forms. In this app code, you will walk through UI buiding up itself just by writing some attributes in `iparams.json`

#### Product serverless events
As soon as a deal is created within Freshsales, you might want your app to perform business logic. But doesn't Freshworks CRM have the same event? Some of the code written will walk you to help you learn do handle these events better without confusion.
