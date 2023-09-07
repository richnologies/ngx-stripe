import { inject } from '@angular/core';

import { StripeConstructorOptions } from '@stripe/stripe-js';

import { STRIPE_PUBLISHABLE_KEY } from '../interfaces/ngx-stripe.interface';
import { StripeServiceInterface } from '../interfaces/stripe-instance.interface';

import { StripeFactoryService } from '../services/stripe-factory.service';
import { StripeService } from '../services/stripe.service';

export function injectStripe(publishableKey?: string, options?: StripeConstructorOptions): StripeServiceInterface {
  console.log('injectStripe...')
  const factory = inject(StripeFactoryService);
  return factory.create(publishableKey, options);
}
