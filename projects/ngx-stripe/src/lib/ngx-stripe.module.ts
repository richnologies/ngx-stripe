import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { StripeConstructorOptions } from '@stripe/stripe-js';

import { StripeAddressComponent } from './components/address.component';
import { StripeAffirmMessageComponent } from './components/affirm-message.component';
import { StripeAfterpayClearpayMessageComponent } from './components/afterpay-clearpay-message.component';
import { StripeCardComponent } from './components/card.component';
import { StripeCardNumberComponent } from './components/card-number.component';
import { StripeCardExpiryComponent } from './components/card-expiry.component';
import { StripeCardCvcComponent } from './components/card-cvc.component';
import { StripeEpsBankComponent } from './components/eps-bank.component';
import { StripeFpxBankComponent } from './components/fpx-bank.component';
import { StripeIbanComponent } from './components/iban.component';
import { StripeIdealBankComponent } from './components/ideal-bank.component';
import { StripeIssuingCardCvcDisplayComponent } from './components/issuing-card-cvc.component';
import { StripeIssuingCardExpiryDisplayComponent } from './components/issuing-card-expiry.component';
import { StripeIssuingCardNumberDisplayComponent } from './components/issuing-card-number.component';
import { StripeIssuingCardPinDisplayComponent } from './components/issuing-card-pin.component';
import { StripeLinkAuthenticationComponent } from './components/link-authentication.component';
import { StripeP24BankComponent } from './components/p24-bank.component';
import { StripeAuBankAccountComponent } from './components/au-bank-account.component';
import { StripePaymentElementComponent } from './components/payment-element.component';
import { StripePaymentMethodMessagingComponent } from './components/payment-method-messaging.component';
import { StripePaymentRequestButtonComponent } from './components/payment-request-button.component';

import { StripeCardGroupDirective } from './directives/card-group.directive';
import { StripeElementsDirective } from './directives/elements.directive';
import { NgxStripeElementLoadingTemplateDirective } from './directives/stripe-element-loading-template.directive';

import { NGX_STRIPE_VERSION, STRIPE_OPTIONS, STRIPE_PUBLISHABLE_KEY } from './interfaces/ngx-stripe.interface';

import { LazyStripeAPILoader } from './services/api-loader.service';
import { WindowRef } from './services/window-ref.service';
import { DocumentRef } from './services/document-ref.service';
import { StripeService } from './services/stripe.service';
import { StripeFactoryService } from './services/stripe-factory.service';
import { StripeElementsService } from './services/stripe-elements.service';

const components = [
  StripeAddressComponent,
  StripeAffirmMessageComponent,
  StripeAfterpayClearpayMessageComponent,
  StripeCardComponent,
  StripeCardNumberComponent,
  StripeCardExpiryComponent,
  StripeCardCvcComponent,
  StripeEpsBankComponent,
  StripeFpxBankComponent,
  StripeIbanComponent,
  StripeIdealBankComponent,
  StripeIssuingCardCvcDisplayComponent,
  StripeIssuingCardExpiryDisplayComponent,
  StripeIssuingCardNumberDisplayComponent,
  StripeIssuingCardPinDisplayComponent,
  StripeLinkAuthenticationComponent,
  StripeP24BankComponent,
  StripeAuBankAccountComponent,
  StripePaymentElementComponent,
  StripePaymentMethodMessagingComponent,
  StripePaymentRequestButtonComponent
];

const directives = [StripeCardGroupDirective, StripeElementsDirective, NgxStripeElementLoadingTemplateDirective];

const currentVersion = '16.1.0';

@NgModule({
  exports: [...components, ...directives],
  imports: [CommonModule, ...components, ...directives]
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
        StripeElementsService,
        WindowRef,
        DocumentRef,
        {
          provide: STRIPE_PUBLISHABLE_KEY,
          useValue: publishableKey
        },
        {
          provide: STRIPE_OPTIONS,
          useValue: options
        },
        {
          provide: NGX_STRIPE_VERSION,
          useValue: currentVersion
        }
      ]
    };
  }

  /**
   * @deprecated
   */
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
        StripeElementsService,
        WindowRef,
        DocumentRef,
        {
          provide: STRIPE_PUBLISHABLE_KEY,
          useValue: publishableKey
        },
        {
          provide: STRIPE_OPTIONS,
          useValue: options
        },
        {
          provide: NGX_STRIPE_VERSION,
          useValue: currentVersion
        }
      ]
    };
  }
}
