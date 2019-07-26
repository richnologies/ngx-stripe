import { Observable } from 'rxjs';

import { Element } from '../interfaces/element';
import { ElementsOptions, Elements } from '../interfaces/elements';
import {
  BankAccount,
  Pii,
  CardDataOptions,
  BankAccountData,
  PiiData,
  TokenResult
} from '../interfaces/token';
import { SourceData, SourceResult, SourceParams } from '../interfaces/sources';
import { PaymentRequestOptions } from '../interfaces/payment-request';
import {
  HandleCardPaymentOptions,
  PaymentIntentResult,
  ConfirmPaymentIntentOptions,
  PaymentMethodData,
  PaymentMethodResult,
} from '../interfaces/payment-intent';
import { StripeJS } from '../interfaces/stripe';
import { CardSetupResult } from '../interfaces/card-setup';

export interface StripeServiceInterface {
  getInstance(): StripeJS | undefined;
  elements(options?: ElementsOptions): Observable<Elements>;
  createToken(
    a: Element | BankAccount | Pii,
    b: CardDataOptions | BankAccountData | PiiData | undefined
  ): Observable<TokenResult>;
  createSource(
    a: Element | SourceData,
    b?: SourceData | undefined
  ): Observable<SourceResult>;
  retrieveSource(source: SourceParams): Observable<SourceResult>;
  paymentRequest(options: PaymentRequestOptions): any;
  handleCardAction(a: string): Observable<PaymentIntentResult>;
  handleCardPayment(
    a: string,
    b?: Element | HandleCardPaymentOptions,
    c?: HandleCardPaymentOptions | undefined
  ): Observable<PaymentIntentResult>;
  confirmPaymentIntent(
    a: string,
    b?: ConfirmPaymentIntentOptions
  ): Observable<PaymentIntentResult>;
  createPaymentMethod(
    a: string,
    b: Element,
    c?: PaymentMethodData
  ): Observable<PaymentMethodResult>;
  handleCardSetup(
    a: string,
    b?: Element | string | PaymentMethodData,
    c?: PaymentMethodData
  ): Observable<CardSetupResult>;
}
