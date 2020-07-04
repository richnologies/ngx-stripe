import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  StripeElements,
  StripeCardElementOptions,
  StripeCardNumberElementOptions,
  StripeCardExpiryElementOptions,
  StripeFpxBankElementOptions,
  StripeIbanElementOptions,
  StripeIdealBankElementOptions,
  StripeAuBankAccountElementOptions
} from '../interfaces/stripejs.interface';

import { StripeService } from './stripe.service';

@Injectable({ providedIn: 'root' })
export class StripeElementsService {
  constructor(private stripeService: StripeService) {}

  elements(stripe, options): Observable<StripeElements> {
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

  mergeOptions(
    options: StripeCardElementOptions,
    containerClass: string
  ): StripeCardElementOptions;
  mergeOptions(
    options: StripeCardNumberElementOptions,
    containerClass: string
  ): StripeCardNumberElementOptions;
  mergeOptions(
    options: StripeCardExpiryElementOptions,
    containerClass: string
  ): StripeCardExpiryElementOptions;
  mergeOptions(
    options: StripeFpxBankElementOptions,
    containerClass: string
  ): StripeFpxBankElementOptions;
  mergeOptions(
    options: StripeIbanElementOptions,
    containerClass: string
  ): StripeIbanElementOptions;
  mergeOptions(
    options: StripeIdealBankElementOptions,
    containerClass: string
  ): StripeIdealBankElementOptions;
  mergeOptions(
    options: StripeAuBankAccountElementOptions,
    containerClass: string
  ): StripeAuBankAccountElementOptions;
  mergeOptions(options, containerClass: string) {
    if (!containerClass || (options && options.classes)) {
      return options;
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

    return options;
  }
}
