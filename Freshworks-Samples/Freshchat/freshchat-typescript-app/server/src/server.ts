import axios from 'axios';
import { dummy } from '@freshworks-jaya/marketplace-models';
import {
  EventPayloadVanilla,
  ProductEventPayloadVanilla,
} from './interfaces/EventPayload';

dummy.trim();

const callWebhook = async (
  webhookUrl: string,
  data: EventPayloadVanilla
): Promise<void> => {
  try {
    await axios.post(webhookUrl, JSON.stringify(data));
  } catch (err) {
    return Promise.reject(new Error('Incorrect Webhook url'));
  }

  return Promise.resolve();
};

exports = {
  events: [
    { callback: 'onAppInstallCallback', event: 'onAppInstall' },
    { callback: 'onAppUninstallCallback', event: 'onAppUninstall' },
    { callback: 'onConversationCreateCallback', event: 'onConversationCreate' },
    { callback: 'onConversationUpdateCallback', event: 'onConversationUpdate' },
    { callback: 'onMessageCreateCallback', event: 'onMessageCreate' },
  ],

  /**
   * App setup event which is triggered at the time of installation.
   */
  onAppInstallCallback(payload: EventPayloadVanilla): void {
    callWebhook(payload.iparams.webhookUrl, payload);
    renderData();
  },
  /**
   * When you click the uninstall icon, the `onAppUninstall` event occurs
   * and then the registered callback method is executed.
   */
  onAppUninstallCallback(payload: EventPayloadVanilla): void {
    callWebhook(payload.iparams.webhookUrl, payload);
    renderData();
  },
  /**
   * Payload passed to the `onConversationCreate` callback.
   */
  onConversationCreateCallback(payload: ProductEventPayloadVanilla): void {
    callWebhook(payload.iparams.webhookUrl, payload);
  },
  /**
   * Payload passed to the `onConversationUpdateCallback` callback.
   */
  onConversationUpdateCallback(payload: ProductEventPayloadVanilla): void {
    callWebhook(payload.iparams.webhookUrl, payload);
  },
  /**
   * Payload passed to the `onMessageCreateCallback` callback.
   */
  onMessageCreateCallback(payload: ProductEventPayloadVanilla): void {
    callWebhook(payload.iparams.webhookUrl, payload);
  },
};
