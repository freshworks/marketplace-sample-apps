'use strict';

const thirdPartyEndpoint = 'https://fcc15baf9a2e24ef7421ffe101394ca7.m.pipedream.net';

exports = {
  events: [
    { event: 'onAppInstall', callback: 'onInstallHandler' },
    { event: 'onAppUninstall', callback: 'onUninstallHandler' },
    { event: 'onExternalEvent', callback: 'onExternalEventHandler' }
  ],
  onInstallHandler: async function (payload) {
    try {
      const webhook = await generateTargetUrl();
      const options = {
        body: `{'webhook': ${webhook}}`,
        action: 'register'
      };
      const { response } = await $request.post(thirdPartyEndpoint, options);

      console.info('\n Webhook creation successful \n', webhook);
      console.info('\n Webhook Registration Successful \n', response);
      console.info('\n Hander received following payload when app is installed \n\n', payload);

      renderData();
    } catch (error) {
      console.error('Something went wrong. Webhook Registration has failed');
    }
  },
  onUninstallHandler: async function (payload) {
    try {
      const options = {
        action: 'de-register'
      };
      const { response } = await $request.post(thirdPartyEndpoint, options);
      console.info('\n Webhook De-Registration Successful \n', response);
      console.info('\n Hander received following payload when app is uninstalled \n\n', payload);
    } catch (error) {
      console.error('Something went wrong. Webhook De-Registration has failed', error);
    }
    renderData();
  },
  onExternalEventHandler: function (payload) {
    const { data } = payload;
    console.info('\n Desired action occured within 3rd party');
    console.info(' onExternalEventHandler invoked with following data: \n', data);
  }
};
