import { InjectionToken } from '@angular/core';

import { Elements, ElementsOptions } from './elements';
import { Element } from './element';
import {
  Account,
  AccountData,
  BankAccount,
  BankAccountData,
  CardDataOptions,
  Pii,
  PiiData,
  TokenResult
} from './token';
import { SourceData, SourceParams, SourceResult } from './sources';
import { PaymentRequestOptions } from './payment-request';
import {
  HandleCardPaymentOptions,
  PaymentIntentResult,
  ConfirmPaymentIntentOptions,
  PaymentMethodData,
  PaymentMethodResult
} from './payment-intent';

export const STRIPE_PUBLISHABLE_KEY = new InjectionToken<string>(
  'Stripe Publishable Key'
);
export const STRIPE_OPTIONS = new InjectionToken<Options>('Stripe Options');

export interface StripeJS {
  elements(options?: ElementsOptions): Elements;
  createToken(el: Element, cardData?: CardDataOptions): Promise<TokenResult>;
  createToken(account: Account, accountData: AccountData): Promise<TokenResult>;
  createToken(
    account: BankAccount,
    bankAccountData: BankAccountData
  ): Promise<TokenResult>;
  createToken(pii: Pii, piiData: PiiData): Promise<TokenResult>;
  createSource(el: Element, sourceData?: SourceData): Promise<SourceResult>;
  createSource(sourceData: SourceData): Promise<SourceResult>;
  retrieveSource(source: SourceParams): Promise<SourceResult>;
  paymentRequest(options: PaymentRequestOptions): any;
  handleCardPayment(
    clientSecret: string,
    cardElement: Element,
    data?: HandleCardPaymentOptions
  ): Promise<PaymentIntentResult>;
  handleCardAction(clientSecret: string): Promise<PaymentIntentResult>;
  confirmPaymentIntent(
    clientSecret: string,
    data?: ConfirmPaymentIntentOptions
  ): Promise<PaymentIntentResult>;
  createPaymentMethod(
    type: string,
    cardElement: Element,
    data?: PaymentMethodData
  ): Promise<PaymentMethodResult>;
}

export interface Options {
  stripeAccount?: string;
}
