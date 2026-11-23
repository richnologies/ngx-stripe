import { inject } from '@angular/core';

import { StripeConstructorOptions } from '@stripe/stripe-js';

import { NGX_STRIPE_VERSION, STRIPE_PUBLISHABLE_KEY } from '../interfaces/ngx-stripe.interface';
import { StripeServiceInterface } from '../interfaces/stripe-instance.interface';

import { StripeFactoryService } from '../services/stripe-factory.service';
import { StripeService } from '../services/stripe.service';

import { NGX_STRIPE_MISSING_KEY, ngxStripeNotProvided } from './setup-errors';

export function injectStripe(publishableKey?: string, options?: StripeConstructorOptions): StripeServiceInterface {
  if (!inject(NGX_STRIPE_VERSION, { optional: true })) {
    ngxStripeNotProvided();
  }

  if (publishableKey) {
    const factory = inject(StripeFactoryService);
    return factory.create(publishableKey, options);
  } else if (inject(STRIPE_PUBLISHABLE_KEY, { optional: true })) {
    return inject(StripeService);
  }

  throw new Error(NGX_STRIPE_MISSING_KEY);
}
