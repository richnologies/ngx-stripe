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
  StripeIbanElementOptions,
  StripePaymentRequestButtonElementOptions,
  StripePaymentElementOptions,
  StripeAddressElementOptions,
  StripeLinkAuthenticationElementOptions,
  StripeIssuingCardNumberDisplayElementOptions,
  StripeIssuingCardCvcDisplayElementOptions,
  StripeIssuingCardExpiryDisplayElementOptions,
  StripeIssuingCardPinDisplayElementOptions,
  StripeIssuingCardCopyButtonElementOptions,
  StripeElementsOptionsClientSecret,
  StripeElementsOptionsMode,
  StripeElementsOptions,
  StripePaymentMethodMessagingElementOptions,
  StripeExpressCheckoutElementOptions,
  StripeTaxIdElementOptions,
  StripeCurrencySelectorElementOptions,
  StripeContactDetailsElementOptions,
  StripeTermsElementOptions
} from '@stripe/stripe-js';

import { StripeService } from './stripe.service';

@Injectable()
export class StripeElementsService {
  constructor(private stripeService: StripeService) {}

  elements(stripe: any, options?: StripeElementsOptionsClientSecret): Observable<StripeElements>;
  elements(stripe: any, options?: StripeElementsOptionsMode): Observable<StripeElements>;
  elements(stripe: any, options?: StripeElementsOptions): Observable<StripeElements>;
  elements(stripe: any, options?: any): Observable<StripeElements> {
    if (stripe) {
      if (options && Object.keys(options).length > 0) {
        return stripe.elements(options);
      }
      return stripe.elements();
    } else {
      if (options && Object.keys(options).length > 0) {
        return this.stripeService.elements(options);
      }
      return this.stripeService.elements();
    }
  }

  paymentRequest(stripe: any, options: PaymentRequestOptions): PaymentRequest {
    return stripe ? stripe.paymentRequest(options) : this.stripeService.paymentRequest(options);
  }

  mergeOptions(options: StripeCardElementOptions, containerClass: string): StripeCardElementOptions;
  mergeOptions(options: StripeCardNumberElementOptions, containerClass: string): StripeCardNumberElementOptions;
  mergeOptions(options: StripeCardExpiryElementOptions, containerClass: string): StripeCardExpiryElementOptions;
  mergeOptions(options: StripeIbanElementOptions, containerClass: string): StripeIbanElementOptions;
  mergeOptions(options: StripeAuBankAccountElementOptions, containerClass: string): StripeAuBankAccountElementOptions;
  mergeOptions(options: StripeAddressElementOptions, containerClass: string): StripeAddressElementOptions;
  mergeOptions(
    options: StripeLinkAuthenticationElementOptions,
    containerClass: string
  ): StripeLinkAuthenticationElementOptions;
  mergeOptions(
    options: StripeIssuingCardNumberDisplayElementOptions,
    containerClass: string
  ): StripeIssuingCardNumberDisplayElementOptions;
  mergeOptions(
    options: StripeIssuingCardCvcDisplayElementOptions,
    containerClass: string
  ): StripeIssuingCardCvcDisplayElementOptions;
  mergeOptions(
    options: StripeIssuingCardExpiryDisplayElementOptions,
    containerClass: string
  ): StripeIssuingCardExpiryDisplayElementOptions;
  mergeOptions(
    options: StripeIssuingCardPinDisplayElementOptions,
    containerClass: string
  ): StripeIssuingCardPinDisplayElementOptions;
  mergeOptions(
    options: StripeIssuingCardCopyButtonElementOptions,
    containerClass: string
  ): StripeIssuingCardCopyButtonElementOptions;
  mergeOptions(
    options: StripePaymentMethodMessagingElementOptions,
    containerClass: string
  ): StripePaymentMethodMessagingElementOptions;
  mergeOptions(
    options: StripePaymentRequestButtonElementOptions,
    containerClass: string
  ): StripePaymentRequestButtonElementOptions;
  mergeOptions(options: StripePaymentElementOptions, containerClass: string): StripePaymentElementOptions;
  mergeOptions(
    options: StripeExpressCheckoutElementOptions,
    containerClass: string
  ): StripeExpressCheckoutElementOptions;
  mergeOptions(options: StripeTaxIdElementOptions, containerClass: string): StripeTaxIdElementOptions;
  mergeOptions(
    options: StripeCurrencySelectorElementOptions,
    containerClass: string
  ): StripeCurrencySelectorElementOptions;
  mergeOptions(
    options: StripeContactDetailsElementOptions,
    containerClass: string
  ): StripeContactDetailsElementOptions;
  mergeOptions(options: StripeTermsElementOptions, containerClass: string): StripeTermsElementOptions;
  mergeOptions(options: any, containerClass: string): any {
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
