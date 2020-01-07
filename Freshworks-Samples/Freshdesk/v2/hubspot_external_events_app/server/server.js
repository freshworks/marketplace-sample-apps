var util = require('./lib/util');

const CONTACT_CREATION = "contact.creation";
const APP_REGISTRATION_ERR = 'App registration failed';
const APP_DEREGISTRATION_ERR = 'App deregistration failed';

/**
 * Creates a subscription with the registered webhook for listening to contact creation events in Hubspot
 * @param {String} appId - The App Identifier for the Hubspot App.
 * @param {String} hubspotUrl - The API endpoint url for Hubspot.
 * @param {String} hubspotKey - The Hubspot API key 
 */
function createSubscriptionForHubspotContactCreation(appId, hubspotUrl, hubspotKey) {
  var url = `${hubspotUrl}/webhooks/v1/${appId}/subscriptions?hapikey=${hubspotKey}`
  var reqData = {
    json: {
      subscriptionDetails: {
        "subscriptionType": CONTACT_CREATION
      },
      "enabled": true
    }
  };
  $request.post(url, reqData).then(function (data, err) {
    if (err) {
      console.error(`Subscription for Hubspot event ${CONTACT_CREATION} failed.`, JSON.stringify(err));
    }
  });
}

/**
 * Creates a contact in Freshdesk
 * @param {String} freshdeskDomain - Freshdesk domain url.
 * @param {String} hubspotName - The user name created in Hubspot.
 * @param {String} hubspotEmail - The user email id created in Hubspot.
 * @param {String} hubspotJobtitle - The job title of the user created in Hubspot.
 */
function createFreshdeskContact(freshdeskDomain, hubspotName, hubspotEmail, hubspotJobtitle) {
  var url = `${freshdeskDomain}/api/v2/contacts`
  var headers = {
    Authorization: util.getFreshdeskKey(args)
  };
  var reqData = {
    headers : headers,
    json: {
      name: hubspotName,
      email: hubspotEmail,
      job_title: hubspotJobtitle
    }
  };
  $request.post(url, reqData).then(function (data, err) {
    if (err) {
      console.error('Contact creation failed in Freshdesk.', JSON.stringify(err));
    }
  });
}

/**
 * Deletes a webhook subscription in Hubspot for a given subscriptionId
 * @param {String} appId - The App Identifier for the Hubspot App.
 * @param {String} hubspotUrl - The API endpoint url for Hubspot.
 * @param {String} hubspotKey - The Hubspot API key
 * @param {String} subscriptionId - The subscription identifier for subscription created in Hubspot.
 */
function deleteSubscription(appId, hubspotUrl, hubspotKey, subscriptionId) {
  var url = `${hubspotUrl}/webhooks/v1/${appId}/subscriptions/${subscriptionId}?hapikey=${hubspotKey}`
  $request.delete(url, {}).then(function (data, err) {
      if (err) {
        console.error(`Subscription ${subscriptionId} deletion failed.`, JSON.stringify(err));
      }
      console.log(`Subscription ${subscriptionId} deleted successfully`);
    });
}

exports = {
  events: [{
      event: 'onContactCreate',
      callback: 'onContactCreateCallback'
    },
    {
      event: 'onAppInstall',
      callback: 'onAppInstallHandler'
    },
    {
      event: 'onExternalEvent',
      callback: 'onHubSpotCallbackHandler'
    },
    {
      event: 'onAppUninstall',
      callback: 'onHubSpotUninstallHandler'
    }
  ],
  /**
   * onAppInstall:
   * Webhook url is created through generateTargetUrl function
   * The generated url is registered with Hubspot for "contact.created" subscription  and the same is triggered when a contact is created in Hubspot.
   * @param {Object} args Payload information returned by Freshdesk API upon App installation event 
   */
  onAppInstallHandler: function (args) {
    generateTargetUrl().then(function (targetUrl) {

      var url = `${args.iparams.hubspot_url}/webhooks/v1/${args.iparams.hubspot_app_id}/settings?hapikey=${args.iparams.hubspot_dev_key}`
      var headers = {
        "Authorization": "Basic " + util.getHubSpotKey(args)
      };
      var reqData = {
        headers: headers,
        json: {
          "webhookUrl": targetUrl,
          "maxConcurrentRequests": 25
        }
      };
      $request.put(url, reqData).then(function (data) {
        console.log(JSON.stringify(data));
        renderData();
        createSubscriptionForHubspotContactCreation(args.iparams.hubspot_app_id, args.iparams.hubspot_url, args.iparams.hubspot_dev_key);
      }, function (err) {
        console.error('Webhook registration with Hubspot failed.', JSON.stringify(err));
        renderData({
          message: APP_REGISTRATION_ERR
        });
      });
    }, function (err) {
      console.error('Target URL generation failed.', JSON.stringify(err));
      renderData({
        message: APP_REGISTRATION_ERR
      });
    });
  },
  /**
   * onContactCreate:
   * Creates a contact in Hubspot whenever a contact is created in Freshdesk
   * @param {Object} args Payload information returned by Freshdesk API upon contact creation event 
   */
  onContactCreateCallback: function (args) {
    var url = `${args.iparams.hubspot_url}/contacts/v1/contact`
    var headers = {
      "Authorization": "Bearer <%= access_token %>",
      "Content-Type": "application/json"
    };
    var reqData = {
      headers: headers,
      isOAuth: true,
      json: {
        "properties": [{
            "property": "firstname",
            value: args.data.contact.name
          },
          {
            "property": "phone",
            value: args.data.contact.phone
          },
          {
            "property": "email",
            value: args.data.contact.email
          }
        ]
      }
    };
    $request.post(url, reqData).then(function (data, err) {
      if (err) {
        console.error('Contact creation in HubSpot failed.', JSON.stringify(err));
      }
    });
  },
  /**
   * onHubSpotCallback:
   * Creates a contact in Freshdesk whenever a contact is created in Hubspot.
   * @param {Object} args Payload information returned by Freshdesk API upon external event with Hubspot
   */
  onHubSpotCallbackHandler: function (args) {
    if (args.data[0].subscriptionType === CONTACT_CREATION) {
      var url = `${args.iparams.hubspot_url}/contacts/v1/contact/vid/${args.data[0].objectId}/profile`
      var headers = {
        "Authorization": "Bearer <%= access_token %>",
        "Content-Type": "application/json"
      };
      var reqData = {
        headers: headers,
        isOAuth: true
      };
      $request.get(url, reqData)
        .then(function (data) {
          var contact = JSON.parse(data.response);
          createFreshdeskContact(args.iparams.freshdesk_domain,
            contact.properties.firstname.value,
            contact.properties.email.value,
            contact.properties.jobtitle.value);
        }, function (err) {
          console.error('Contact fetching failed from Hubspot.', JSON.stringify(err));
        });
    }
  },
  /**
   * onHubSpotUninstall:
   * Deregisters the webhook with Hubspot by fetching all the webhook subscriptions created for the app and deleting all of them.
   * @param {Object} args Payload information returned by Freshdesk API upon App uninstallation event 
   */
  onHubSpotUninstallHandler: function (args) {
    /* You cannot deregister/delete a webhook directly in Hubspot, deleting all subscriptions is the only way to deregister the webhook 
      For more info, refer https://developers.hubspot.com/docs/methods/webhooks/webhooks-overview */
    var url = `${args.iparams.hubspot_url}/webhooks/v1/${args.iparams.hubspot_app_id}/subscriptions?hapikey=${args.iparams.hubspot_dev_key}`
    $request.get(url, {}) .then(function (data) {
        console.log('list of subscriptions:', JSON.stringify(data));
        subscriptions = JSON.parse(data.response);
        subscriptions.forEach(item => {
          deleteSubscription(args.iparams.hubspot_app_id, args.iparams.hubspot_url, args.iparams.hubspot_dev_key, item.id);
        });
        renderData();
      }, function (err) {
        console.log('Error fetching list of subscriptions', JSON.stringify(err));
        renderData({
          message: APP_DEREGISTRATION_ERR
        });
      });
  }
};

