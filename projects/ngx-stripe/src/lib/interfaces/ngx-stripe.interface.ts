import { InjectionToken } from '@angular/core';

import { StripeConstructorOptions } from '@stripe/stripe-js';

export const STRIPE_PUBLISHABLE_KEY = new InjectionToken<string>(
  'Stripe Publishable Key'
);
export const STRIPE_OPTIONS = new InjectionToken<StripeConstructorOptions>(
  'Stripe Options'
);
