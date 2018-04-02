import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, from, of } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { WindowRef } from './window-ref.service';
import { LazyStripeAPILoader, Status } from './api-loader.service';

import {
  STRIPE_PUBLISHABLE_KEY,
  StripeJS,
  STRIPE_OPTIONS,
  Options
} from '../interfaces/stripe';
import { Element } from '../interfaces/element';
import { Elements, ElementsOptions } from '../interfaces/elements';
import {
  SourceData,
  SourceResult,
  isSourceData,
  SourceParams
} from '../interfaces/sources';
import {
  CardDataOptions,
  TokenResult,
  BankAccount,
  BankAccountData,
  PiiData,
  Pii,
  isBankAccount,
  isBankAccountData,
  isPii,
  isPiiData
} from '../interfaces/token';
import { StripeServiceInterface } from './stripe-instance.interface';
import { PaymentRequestOptions } from '../interfaces/payment-request';

export class StripeInstance implements StripeServiceInterface {
  private stripe!: StripeJS;

  constructor(
    private platformId: any,
    private loader: LazyStripeAPILoader,
    private window: WindowRef,
    private key: string,
    private options?: Options
  ) {
    this.stripeObject().subscribe((Stripe: any) => {
      if (Stripe) {
        this.stripe = this.options
          ? (Stripe(this.key, this.options) as StripeJS)
          : (Stripe(this.key) as StripeJS);
      }
    });
  }

  public getInstance() {
    return this.stripe;
  }

  public elements(options?: ElementsOptions): Observable<Elements> {
    return this.stripeObject().pipe(map(() => this.stripe.elements(options)));
  }

  public createToken(
    a: Element | BankAccount | Pii,
    b: CardDataOptions | BankAccountData | PiiData | undefined
  ): Observable<TokenResult> {
    if (isBankAccount(a) && isBankAccountData(b)) {
      return from(this.stripe.createToken(a, b));
    } else if (isPii(a) && isPiiData(b)) {
      return from(this.stripe.createToken(a, b));
    } else {
      return from(
        this.stripe.createToken(a as Element, b as CardDataOptions | undefined)
      );
    }
  }

  public createSource(
    a: Element | SourceData,
    b?: SourceData | undefined
  ): Observable<SourceResult> {
    if (isSourceData(a)) {
      return from(this.stripe.createSource(a as SourceData));
    }
    return from(this.stripe.createSource(a as Element, b));
  }

  public retrieveSource(source: SourceParams): Observable<SourceResult> {
    return from(this.stripe.retrieveSource(source));
  }

  public paymentRequest(options: PaymentRequestOptions) {
    return this.stripe.paymentRequest(options);
  }

  private stripeObject(): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return of(null);
    }
    return this.loader
      .asStream()
      .pipe(
        filter((status: Status) => status.loaded === true),
        map(() => (this.window.getNativeWindow() as any).Stripe)
      );
  }
}
