import { Inject, Injectable } from '@angular/core';

import { Options, STRIPE_OPTIONS, STRIPE_PUBLISHABLE_KEY } from '../interfaces/stripe';
import { LazyStripeAPILoader } from './api-loader.service';
import { WindowRef } from './window-ref.service';
import { StripeInstance } from './stripe-instance.class';

@Injectable()
export class StripeFactoryService {
  constructor(
    @Inject(STRIPE_PUBLISHABLE_KEY) private baseKey: string,
    @Inject(STRIPE_OPTIONS) private baseOptions: string,
    private loader: LazyStripeAPILoader,
    private window: WindowRef
  ) {}

  public create(key: string, options?: Options): StripeInstance {
    return new StripeInstance(this.loader, this.window, key, options);
  }
}
