import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { STRIPE_PUBLISHABLE_KEY, STRIPE_OPTIONS } from '../interfaces/stripe';
import { LazyStripeAPILoader } from 'src/services/api-loader.service';
import { WindowRef } from 'src/services/window-ref';
import { Stripe } from 'src/services/stripejs';

@Injectable()
export class StripeFactoryService {
  constructor(
    @Inject(STRIPE_PUBLISHABLE_KEY) private baseKey: string,
    @Inject(STRIPE_OPTIONS) private baseOptions: string,
    private loader: LazyStripeAPILoader,
    private window: WindowRef
  ) {}

  public create(key: string, options?: string): Stripe {
    return new Stripe(this.loader, this.window, key, options);
  }
}
