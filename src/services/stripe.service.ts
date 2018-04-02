import { Injectable, Inject, PLATFORM_ID } from '@angular/core';

import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

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
import { StripeInstance } from './stripe-instance.class';
import { StripeServiceInterface } from './stripe-instance.interface';
import { PaymentRequestOptions } from '../interfaces/payment-request';

@Injectable()
export class StripeService implements StripeServiceInterface {
  private stripe!: StripeInstance;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(STRIPE_PUBLISHABLE_KEY) private key: string,
    @Inject(STRIPE_OPTIONS) private options: Options,
    private loader: LazyStripeAPILoader,
    private window: WindowRef
  ) {
    if (key) {
      this.stripe = new StripeInstance(
        this.platformId,
        this.loader,
        this.window,
        key,
        options
      );
    }
  }

  public getStripeReference(): Observable<any> {
    return this.loader
      .asStream()
      .pipe(
        filter((status: Status) => status.loaded === true),
        map(() => (this.window.getNativeWindow() as any).Stripe)
      );
  }

  public getInstance() {
    return this.stripe.getInstance();
  }

  public setKey(key: string, options?: Options) {
    return this.changeKey(key, options);
  }

  public changeKey(key: string, options?: Options) {
    this.stripe = new StripeInstance(
      this.platformId,
      this.loader,
      this.window,
      key,
      options
    );

    return this.stripe;
  }

  public elements(options?: ElementsOptions): Observable<Elements> {
    return this.stripe.elements(options);
  }

  public createToken(
    a: Element | BankAccount | Pii,
    b: CardDataOptions | BankAccountData | PiiData | undefined
  ): Observable<TokenResult> {
    return this.stripe.createToken(a, b);
  }

  public createSource(
    a: Element | SourceData,
    b?: SourceData | undefined
  ): Observable<SourceResult> {
    return this.stripe.createSource(a, b);
  }

  public retrieveSource(source: SourceParams): Observable<SourceResult> {
    return this.stripe.retrieveSource(source);
  }

  public paymentRequest(options: PaymentRequestOptions) {
    return this.stripe.paymentRequest(options);
  }
}
