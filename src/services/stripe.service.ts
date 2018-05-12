import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Options, STRIPE_OPTIONS, STRIPE_PUBLISHABLE_KEY, StripeJS } from '../interfaces/stripe';
import { Element } from '../interfaces/element';
import { Elements, ElementsOptions } from '../interfaces/elements';
import { SourceData, SourceParams, SourceResult } from '../interfaces/sources';
import { BankAccount, BankAccountData, CardDataOptions, Pii, PiiData, TokenResult } from '../interfaces/token';
import { PaymentRequestOptions } from '../interfaces/payment-request';

import { StripeServiceInterface } from './stripe-instance.interface';
import { StripeInstance } from './stripe-instance.class';
import { WindowRef } from './window-ref.service';
import { LazyStripeAPILoader, Status } from './api-loader.service';


@Injectable()
export class StripeService implements StripeServiceInterface {
  private stripe: StripeInstance | null = null;

  constructor(
    @Inject(STRIPE_PUBLISHABLE_KEY) private key: string,
    @Inject(STRIPE_OPTIONS) private options: Options,
    private loader: LazyStripeAPILoader,
    private window: WindowRef
  ) {
    if (key) {
      this.stripe = new StripeInstance(this.loader, this.window, key, options);
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
    return this.stripe == null ?
      this.stripe as null
      : this.stripe.getInstance() as StripeJS;
  }

  public setKey(key: string, options?: Options) {
    return this.changeKey(key, options);
  }

  public changeKey(key: string, options?: Options) {
    this.stripe = new StripeInstance(this.loader, this.window, key, options);
    return this.stripe;
  }

  public elements(options?: ElementsOptions): Observable<Elements> {
    if (this.stripe == null) return new Observable<Elements>();
    return this.stripe.elements(options);
  }

  public createToken(
    a: Element | BankAccount | Pii,
    b: CardDataOptions | BankAccountData | PiiData | undefined
  ): Observable<TokenResult> {
    if (this.stripe == null) return new Observable<TokenResult>();
    return this.stripe.createToken(a, b);
  }

  public createSource(
    a: Element | SourceData,
    b?: SourceData | undefined
  ): Observable<SourceResult> {
    if (this.stripe == null)
      return new Observable<SourceResult>();
    return this.stripe.createSource(a, b);
  }

  public retrieveSource(source: SourceParams): Observable<SourceResult> {
    if (this.stripe == null) return new Observable<SourceResult>();
    return this.stripe.retrieveSource(source);
  }

  public paymentRequest(options: PaymentRequestOptions) {
    if (this.stripe == null) return;
    return this.stripe.paymentRequest(options);
  }
}
