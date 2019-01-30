import { Injectable, Inject } from '@angular/core';

import {
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_OPTIONS,
  Options
} from '../interfaces/stripe';
import { LazyStripeAPILoader } from './api-loader.service';
import { WindowRef } from './window-ref.service';
import { StripeInstance } from './stripe-instance.class';

@Injectable()
export class StripeFactoryService {
  constructor(
    @Inject(STRIPE_PUBLISHABLE_KEY) public baseKey: string,
    @Inject(STRIPE_OPTIONS) public baseOptions: string,
    public loader: LazyStripeAPILoader,
    public window: WindowRef
  ) {}

  public create(key: string, options?: Options): StripeInstance {
    return new StripeInstance(this.loader, this.window, key, options);
  }
}
