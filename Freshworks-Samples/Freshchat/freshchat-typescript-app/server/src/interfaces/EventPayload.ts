import {
  EventPayload,
  ProductEventData,
} from '@freshworks-jaya/marketplace-models';

export interface Iparams {
  webhookUrl: string;
}

export interface EventPayloadVanilla extends EventPayload {
  iparams: Iparams;
}

export interface ProductEventPayloadVanilla extends EventPayloadVanilla {
  data: ProductEventData;
}
