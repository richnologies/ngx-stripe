import { InjectionToken } from '@angular/core';

import { StripeConstructorOptions } from '@stripe/stripe-js';

export const STRIPE_PUBLISHABLE_KEY = new InjectionToken<string>(
  'Stripe Publishable Key'
);
export const STRIPE_OPTIONS = new InjectionToken<StripeConstructorOptions>(
  'Stripe Options'
);

export const NGX_STRIPE_VERSION = new InjectionToken<string>('NGX_STRIPE_VERSION');

export interface StripeAppInfo {
  name: string;
  url: string;
  partner_id: string;
  version: string;
}
