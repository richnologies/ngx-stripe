import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

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
  StripePaymentRequestButtonElementOptions
} from '@stripe/stripe-js';

import { StripeService } from './stripe.service';
import { StripeInstance } from './stripe-instance.class';

@Injectable()
export class StripeElementsService {
  constructor(private stripeService: StripeService) {}

  public elements(
    stripe: StripeInstance,
    options: StripeElementsOptions = {}
  ): Observable<StripeElements> {
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

  public paymentRequest(
    stripe: StripeInstance,
    options: PaymentRequestOptions
  ): PaymentRequest | undefined {
    return stripe
      ? stripe.paymentRequest(options)
      : this.stripeService.paymentRequest(options);
  }

  public mergeOptions(
    options: StripeCardElementOptions,
    containerClass: string
  ): StripeCardElementOptions;
  public mergeOptions(
    options: StripeCardNumberElementOptions,
    containerClass: string
  ): StripeCardNumberElementOptions;
  public mergeOptions(
    options: StripeCardExpiryElementOptions,
    containerClass: string
  ): StripeCardExpiryElementOptions;
  public mergeOptions(
    options: StripeFpxBankElementOptions,
    containerClass: string
  ): StripeFpxBankElementOptions;
  public mergeOptions(
    options: StripeIbanElementOptions,
    containerClass: string
  ): StripeIbanElementOptions;
  public mergeOptions(
    options: StripeIdealBankElementOptions,
    containerClass: string
  ): StripeIdealBankElementOptions;
  public mergeOptions(
    options: StripeAuBankAccountElementOptions,
    containerClass: string
  ): StripeAuBankAccountElementOptions;
  public mergeOptions(
    options: StripePaymentRequestButtonElementOptions,
    containerClass: string
  ): StripePaymentRequestButtonElementOptions;
  public mergeOptions(options, containerClass: string) {
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
