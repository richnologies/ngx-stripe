import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  PaymentRequest,
  PaymentRequestOptions,
  StripeCardElementOptions,
  StripeAuBankAccountElementOptions,
  StripeCardNumberElementOptions,
  StripeCardExpiryElementOptions,
  StripeElements,
  StripeElementsOptions,
  StripeFpxBankElementOptions,
  StripeIbanElementOptions,
  StripeIdealBankElementOptions,
  StripePaymentRequestButtonElementOptions,
  StripePaymentElementOptions,
  StripeAffirmMessageElementOptions,
  StripeAfterpayClearpayMessageElementOptions,
  StripeEpsBankElementOptions,
  StripeP24BankElementOptions,
  StripeAddressElementOptions,
  StripeLinkAuthenticationElementOptions
} from '@stripe/stripe-js';

import { StripeService } from './stripe.service';

@Injectable()
export class StripeElementsService {
  constructor(private stripeService: StripeService) {}

  elements(stripe, options: StripeElementsOptions = {}): Observable<StripeElements> {
    if (stripe) {
      if (Object.keys(options).length > 0) {
        return stripe.elements(options);
      }
      return stripe.elements();
    } else {
      if (Object.keys(options).length > 0) {
        return this.stripeService.elements(options);
      }
      return this.stripeService.elements();
    }
  }

  paymentRequest(stripe, options: PaymentRequestOptions): PaymentRequest | undefined {
    return stripe ? stripe.paymentRequest(options) : this.stripeService.paymentRequest(options);
  }

  mergeOptions(options: StripeCardElementOptions, containerClass: string): StripeCardElementOptions;
  mergeOptions(options: StripeCardNumberElementOptions, containerClass: string): StripeCardNumberElementOptions;
  mergeOptions(options: StripeCardExpiryElementOptions, containerClass: string): StripeCardExpiryElementOptions;
  mergeOptions(options: StripeFpxBankElementOptions, containerClass: string): StripeFpxBankElementOptions;
  mergeOptions(options: StripeIbanElementOptions, containerClass: string): StripeIbanElementOptions;
  mergeOptions(options: StripeIdealBankElementOptions, containerClass: string): StripeIdealBankElementOptions;
  mergeOptions(options: StripeAuBankAccountElementOptions, containerClass: string): StripeAuBankAccountElementOptions;
  mergeOptions(options: StripeAffirmMessageElementOptions, containerClass: string): StripeAffirmMessageElementOptions;
  mergeOptions(options: StripeAfterpayClearpayMessageElementOptions, containerClass: string): StripeAfterpayClearpayMessageElementOptions;
  mergeOptions(options: StripeEpsBankElementOptions, containerClass: string): StripeEpsBankElementOptions;
  mergeOptions(options: StripeP24BankElementOptions, containerClass: string): StripeP24BankElementOptions;
  mergeOptions(options: StripeAddressElementOptions, containerClass: string): StripeAddressElementOptions;
  mergeOptions(options: StripeLinkAuthenticationElementOptions, containerClass: string): StripeLinkAuthenticationElementOptions;
  mergeOptions(
    options: StripePaymentRequestButtonElementOptions,
    containerClass: string
  ): StripePaymentRequestButtonElementOptions;
  mergeOptions(options: StripePaymentElementOptions, containerClass: string): StripePaymentElementOptions;
  mergeOptions(options, containerClass: string) {
    if (!containerClass || (options && options.classes)) {
      return options || {};
    }

    if (!options || !options.classes) {
      return {
        ...(options || {}),
        classes: {
          base: containerClass,
          complete: `${containerClass}--complete`,
          empty: `${containerClass}--empty`,
          focus: `${containerClass}--focus`,
          invalid: `${containerClass}--invalid`,
          webkitAutoFill: `${containerClass}--webkit-autoFill`
        }
      };
    }

    return options || {};
  }
}
