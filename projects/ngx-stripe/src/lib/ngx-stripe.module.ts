import { ModuleWithProviders, NgModule } from '@angular/core';

import { StripeCardComponent } from './components/stripe-card.component';

import { STRIPE_OPTIONS, STRIPE_PUBLISHABLE_KEY } from './interfaces/ngx-stripe.interface';
import { StripeConstructorOptions } from './interfaces/stripejs.interface';

import { LazyStripeAPILoader } from './services/api-loader.service';
import { WindowRef } from './services/window-ref.service';
import { DocumentRef } from './services/document-ref.service';
import { StripeService } from './services/stripe.service';
import { StripeFactoryService } from './services/stripe-factory.service';

@NgModule({
  declarations: [StripeCardComponent],
  exports: [StripeCardComponent]
})
export class NgxStripeModule {
  public static forRoot(
    publishableKey?: string,
    options?: StripeConstructorOptions
  ): ModuleWithProviders<NgxStripeModule> {
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

  public static forChild(
    publishableKey?: string,
    options?: StripeConstructorOptions
  ): ModuleWithProviders<NgxStripeModule> {
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
