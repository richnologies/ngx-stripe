import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import {
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_OPTIONS,
  Options
} from '../interfaces/stripe';
import { LazyStripeAPILoader } from './api-loader.service';
import { WindowRef } from './window-ref';
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
