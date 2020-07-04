import { ModuleWithProviders, NgModule } from '@angular/core';

import { StripeCardComponent } from './components/card.component';
import { StripeCardNumberComponent } from './components/card-number.component';
import { StripeCardExpiryComponent } from './components/card-expiry.component';
import { StripeCardCvcComponent } from './components/card-cvc.component';
import { StripeFpxBankComponent } from './components/fpx-bank.component';
import { StripeIdealBankComponent } from './components/ideal-bank.component';
import { StripeIbanComponent } from './components/iban.component';
import { StripeAuBankAccountComponent } from './components/au-bank-account.component';

import {
  STRIPE_OPTIONS,
  STRIPE_PUBLISHABLE_KEY
} from './interfaces/ngx-stripe.interface';
import { StripeConstructorOptions } from './interfaces/stripejs.interface';

import { LazyStripeAPILoader } from './services/api-loader.service';
import { WindowRef } from './services/window-ref.service';
import { DocumentRef } from './services/document-ref.service';
import { StripeService } from './services/stripe.service';
import { StripeFactoryService } from './services/stripe-factory.service';

const components = [
  StripeCardComponent,
  StripeCardNumberComponent,
  StripeCardExpiryComponent,
  StripeCardCvcComponent,
  StripeFpxBankComponent,
  StripeIdealBankComponent,
  StripeIbanComponent,
  StripeAuBankAccountComponent
];

@NgModule({
  declarations: [...components],
  exports: [...components]
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
