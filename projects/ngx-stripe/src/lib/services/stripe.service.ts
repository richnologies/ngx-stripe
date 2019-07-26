import { Injectable, Inject } from '@angular/core';

import { Observable } from 'rxjs';

import { WindowRef } from './window-ref.service';
import { LazyStripeAPILoader, Status } from './api-loader.service';

import {
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_OPTIONS,
  Options,
  StripeJS
} from '../interfaces/stripe';
import { Element } from '../interfaces/element';
import { Elements, ElementsOptions } from '../interfaces/elements';
import { SourceData, SourceResult, SourceParams } from '../interfaces/sources';
import {
  CardDataOptions,
  TokenResult,
  Account,
  AccountData,
  BankAccount,
  BankAccountData,
  PiiData,
  Pii
} from '../interfaces/token';
import { StripeInstance } from './stripe-instance.class';
import { StripeServiceInterface } from './stripe-instance.interface';
import { PaymentRequestOptions } from '../interfaces/payment-request';
import { filter, map } from 'rxjs/operators';
import {
  HandleCardPaymentOptions,
  ConfirmPaymentIntentOptions,
  PaymentIntentResult,
  PaymentMethodResult,
  PaymentMethodData,
} from '../interfaces/payment-intent';
import { CardSetupResult } from '../interfaces/card-setup';

@Injectable()
export class StripeService implements StripeServiceInterface {
  public stripe!: StripeInstance;

  constructor(
    @Inject(STRIPE_PUBLISHABLE_KEY) public key: string,
    @Inject(STRIPE_OPTIONS) public options: Options,
    public loader: LazyStripeAPILoader,
    public window: WindowRef
  ) {
    if (key) {
      this.stripe = new StripeInstance(this.loader, this.window, key, options);
    }
  }

  public getStripeReference(): Observable<any> {
    return this.loader.asStream().pipe(
      filter((status: Status) => status.loaded === true),
      map(() => (this.window.getNativeWindow() as any).Stripe)
    );
  }

  public getInstance(): StripeJS | undefined {
    return this.stripe.getInstance();
  }

  public setKey(key: string, options?: Options) {
    return this.changeKey(key, options);
  }

  public changeKey(key: string, options?: Options) {
    this.stripe = new StripeInstance(this.loader, this.window, key, options);

    return this.stripe;
  }

  public elements(options?: ElementsOptions): Observable<Elements> {
    return this.stripe.elements(options);
  }

  public createToken(
    a: Element | Account | BankAccount | Pii,
    b: CardDataOptions | AccountData | BankAccountData | PiiData | undefined
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

  public handleCardPayment(
    a: string,
    b?: Element | HandleCardPaymentOptions,
    c?: HandleCardPaymentOptions | undefined
  ): Observable<PaymentIntentResult> {
    return this.stripe.handleCardPayment(a, b, c);
  }

  public handleCardAction(a: string): Observable<PaymentIntentResult> {
    return this.stripe.handleCardAction(a);
  }

  public createPaymentMethod(
    a: string,
    b: Element,
    c?: PaymentMethodData
  ): Observable<PaymentMethodResult> {
    return this.stripe.createPaymentMethod(a, b, c);
  }

  public confirmPaymentIntent(
    a: string,
    b?: ConfirmPaymentIntentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmPaymentIntent(a, b);
  }

  public handleCardSetup(
    a: string,
    b?: string | Element | PaymentMethodData,
    c?: PaymentMethodData
  ): Observable<CardSetupResult> {
    return this.stripe.handleCardSetup(a, b, c);
  }
}
