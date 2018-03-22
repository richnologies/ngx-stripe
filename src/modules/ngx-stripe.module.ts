import { NgModule, ModuleWithProviders } from '@angular/core';

import { LazyStripeAPILoader } from '../services/api-loader.service';
import { StripeService } from '../services/stripe.service';
import { StripeFactoryService } from '../services/stripe-factory.service';

import { WindowRef } from '../services/window-ref';
import { DocumentRef } from '../services/document-ref';

import {
  Options,
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_OPTIONS
} from '../interfaces/stripe';
import { StripeCardComponent } from '../components/stripe-card.component';

import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/publishLast';

@NgModule({
  declarations: [StripeCardComponent],
  exports: [StripeCardComponent]
})
export class NgxStripeModule {
  public static forRoot(
    publishableKey?: string,
    options?: Options
  ): ModuleWithProviders {
    return {
      ngModule: NgxStripeModule,
      providers: [
        LazyStripeAPILoader,
        StripeService,
        StripeFactoryService,
        WindowRef,
        DocumentRef,
        {
          provide: STRIPE_PUBLISHABLE_KEY,
          useValue: publishableKey
        },
        {
          provide: STRIPE_OPTIONS,
          useValue: options
        }
      ]
    };
  }
}
