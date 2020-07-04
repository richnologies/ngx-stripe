import { Injectable, Inject } from '@angular/core';

import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import * as StripeJS from '../interfaces/stripejs.interface';
import {
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_OPTIONS
} from '../interfaces/ngx-stripe.interface';
import { StripeServiceInterface } from '../interfaces/stripe-instance.interface';

import { WindowRef } from './window-ref.service';
import { LazyStripeAPILoader, Status } from './api-loader.service';

import { StripeInstance } from './stripe-instance.class';

@Injectable()
export class StripeService implements StripeServiceInterface {
  stripe!: StripeInstance;

  constructor(
    @Inject(STRIPE_PUBLISHABLE_KEY) public key: string,
    @Inject(STRIPE_OPTIONS) public options: StripeJS.StripeConstructorOptions,
    public loader: LazyStripeAPILoader,
    public window: WindowRef
  ) {
    if (key) {
      this.stripe = new StripeInstance(this.loader, this.window, key, options);
    }
  }

  getStripeReference(): Observable<any> {
    return this.loader.asStream().pipe(
      filter((status: Status) => status.loaded === true),
      map(() => (this.window.getNativeWindow() as any).Stripe)
    );
  }

  getInstance(): StripeJS.Stripe | undefined {
    return this.stripe.getInstance();
  }

  setKey(key: string, options?: StripeJS.StripeConstructorOptions) {
    return this.changeKey(key, options);
  }

  changeKey(key: string, options?: StripeJS.StripeConstructorOptions) {
    this.stripe = new StripeInstance(this.loader, this.window, key, options);

    return this.stripe;
  }

  elements(
    options?: StripeJS.StripeElementsOptions
  ): Observable<StripeJS.StripeElements> {
    return this.stripe.elements(options);
  }

  redirectToCheckout(
    options?: StripeJS.RedirectToCheckoutOptions
  ): Observable<never | { error: StripeJS.StripeError }> {
    return this.stripe.redirectToCheckout(options);
  }

  confirmAuBecsDebitPayment(
    clientSecret: string,
    data?: StripeJS.ConfirmAuBecsDebitPaymentData
  ): Observable<{
    paymentIntent?: StripeJS.PaymentIntent;
    error?: StripeJS.StripeError;
  }> {
    return this.stripe.confirmAuBecsDebitPayment(clientSecret, data);
  }

  confirmBancontactPayment(
    clientSecret: string,
    data?: StripeJS.ConfirmBancontactPaymentData,
    options?: StripeJS.ConfirmBancontactPaymentOptions
  ): Observable<{
    paymentIntent?: StripeJS.PaymentIntent;
    error?: StripeJS.StripeError;
  }> {
    return this.stripe.confirmBancontactPayment(clientSecret, data, options);
  }

  confirmCardPayment(
    clientSecret: string,
    data?: StripeJS.ConfirmCardPaymentData,
    options?: StripeJS.ConfirmCardPaymentOptions
  ): Observable<{
    paymentIntent?: StripeJS.PaymentIntent;
    error?: StripeJS.StripeError;
  }> {
    return this.stripe.confirmCardPayment(clientSecret, data, options);
  }

  confirmEpsPayment(
    clientSecret: string,
    data?: StripeJS.ConfirmEpsPaymentData,
    options?: StripeJS.ConfirmEpsPaymentOptions
  ): Observable<{
    paymentIntent?: StripeJS.PaymentIntent;
    error?: StripeJS.StripeError;
  }> {
    return this.stripe.confirmEpsPayment(clientSecret, data, options);
  }

  confirmFpxPayment(
    clientSecret: string,
    data?: StripeJS.ConfirmFpxPaymentData,
    options?: StripeJS.ConfirmFpxPaymentOptions
  ): Observable<{
    paymentIntent?: StripeJS.PaymentIntent;
    error?: StripeJS.StripeError;
  }> {
    return this.stripe.confirmFpxPayment(clientSecret, data, options);
  }

  confirmGiropayPayment(
    clientSecret: string,
    data?: StripeJS.ConfirmGiropayPaymentData,
    options?: StripeJS.ConfirmGiropayPaymentOptions
  ): Observable<{
    paymentIntent?: StripeJS.PaymentIntent;
    error?: StripeJS.StripeError;
  }> {
    return this.stripe.confirmGiropayPayment(clientSecret, data, options);
  }

  confirmIdealPayment(
    clientSecret: string,
    data?: StripeJS.ConfirmIdealPaymentData,
    options?: StripeJS.ConfirmIdealPaymentOptions
  ): Observable<{
    paymentIntent?: StripeJS.PaymentIntent;
    error?: StripeJS.StripeError;
  }> {
    return this.stripe.confirmIdealPayment(clientSecret, data, options);
  }

  confirmP24Payment(
    clientSecret: string,
    data?: StripeJS.ConfirmP24PaymentData,
    options?: StripeJS.ConfirmP24PaymentOptions
  ): Observable<{
    paymentIntent?: StripeJS.PaymentIntent;
    error?: StripeJS.StripeError;
  }> {
    return this.stripe.confirmP24Payment(clientSecret, data, options);
  }

  confirmSepaDebitPayment(
    clientSecret: string,
    data?: StripeJS.ConfirmSepaDebitPaymentData
  ): Observable<{
    paymentIntent?: StripeJS.PaymentIntent;
    error?: StripeJS.StripeError;
  }> {
    return this.stripe.confirmSepaDebitPayment(clientSecret, data);
  }

  handleCardAction(
    clientSecret: string
  ): Observable<{
    paymentIntent?: StripeJS.PaymentIntent;
    error?: StripeJS.StripeError;
  }> {
    return this.stripe.handleCardAction(clientSecret);
  }

  createPaymentMethod(
    paymentMethodData: StripeJS.CreatePaymentMethodData
  ): Observable<{
    paymentMethod?: StripeJS.PaymentMethod;
    error?: StripeJS.StripeError;
  }> {
    return this.stripe.createPaymentMethod(paymentMethodData);
  }

  retrievePaymentIntent(
    clientSecret: string
  ): Observable<{
    paymentIntent?: StripeJS.PaymentIntent;
    error?: StripeJS.StripeError;
  }> {
    return this.stripe.retrievePaymentIntent(clientSecret);
  }

  confirmAuBecsDebitSetup(
    clientSecret: string,
    data?: StripeJS.ConfirmAuBecsDebitSetupData
  ): Observable<{
    setupIntent?: StripeJS.SetupIntent;
    error?: StripeJS.StripeError;
  }> {
    return this.stripe.confirmAuBecsDebitSetup(clientSecret, data);
  }

  confirmCardSetup(
    clientSecret: string,
    data?: StripeJS.ConfirmCardSetupData,
    options?: StripeJS.ConfirmCardSetupOptions
  ): Observable<{
    setupIntent?: StripeJS.SetupIntent;
    error?: StripeJS.StripeError;
  }> {
    return this.stripe.confirmCardSetup(clientSecret, data, options);
  }

  confirmSepaDebitSetup(
    clientSecret: string,
    data?: StripeJS.ConfirmSepaDebitSetupData
  ): Observable<{
    setupIntent?: StripeJS.SetupIntent;
    error?: StripeJS.StripeError;
  }> {
    return this.stripe.confirmSepaDebitSetup(clientSecret, data);
  }

  retrieveSetupIntent(
    clientSecret: string
  ): Observable<{
    setupIntent?: StripeJS.SetupIntent;
    error?: StripeJS.StripeError;
  }> {
    return this.stripe.retrieveSetupIntent(clientSecret);
  }

  paymentRequest(
    options: StripeJS.PaymentRequestOptions
  ): StripeJS.PaymentRequest | undefined {
    return this.stripe.paymentRequest(options);
  }

  createToken(
    tokenType: StripeJS.StripeIbanElement,
    data: StripeJS.CreateTokenIbanData
  ): Observable<{ token?: StripeJS.Token; error?: StripeJS.StripeError }>;
  createToken(
    tokenType: StripeJS.StripeCardElement | StripeJS.StripeCardNumberElement,
    data?: StripeJS.CreateTokenCardData
  ): Observable<{ token?: StripeJS.Token; error?: StripeJS.StripeError }>;
  createToken(
    tokenType: 'pii',
    data: StripeJS.CreateTokenPiiData
  ): Observable<{ token?: StripeJS.Token; error?: StripeJS.StripeError }>;
  createToken(
    tokenType: 'bank_account',
    data: StripeJS.CreateTokenBankAccountData
  ): Observable<{ token?: StripeJS.Token; error?: StripeJS.StripeError }>;
  createToken(
    tokenType: 'cvc_update',
    element?: StripeJS.StripeCardCvcElement
  ): Observable<{ token?: StripeJS.Token; error?: StripeJS.StripeError }>;
  createToken(
    tokenType: 'account',
    data: StripeJS.TokenCreateParams.Account
  ): Observable<{ token?: StripeJS.Token; error?: StripeJS.StripeError }>;
  createToken(
    tokenType: 'person',
    data: StripeJS.TokenCreateParams.Person
  ): Observable<{ token?: StripeJS.Token; error?: StripeJS.StripeError }>;
  createToken(tokenType, data) {
    return this.stripe.createToken(tokenType, data);
  }

  createSource(
    element: StripeJS.StripeElement,
    sourceData: StripeJS.CreateSourceData
  ): Observable<{ source?: StripeJS.Source; error?: StripeJS.StripeError }>;
  createSource(
    sourceData: StripeJS.CreateSourceData
  ): Observable<{ source?: StripeJS.Source; error?: StripeJS.StripeError }>;
  createSource(
    a,
    b?
  ): Observable<{ source?: StripeJS.Source; error?: StripeJS.StripeError }> {
    return this.stripe.createSource(a, b);
  }

  retrieveSource(
    source: StripeJS.RetrieveSourceParam
  ): Observable<{ source?: StripeJS.Source; error?: StripeJS.StripeError }> {
    return this.stripe.retrieveSource(source);
  }

  /**
   * @deprecated
   */
  handleCardPayment(
    clientSecret: string,
    element?,
    data?
  ): Observable<{
    paymentIntent?: StripeJS.PaymentIntent;
    error?: StripeJS.StripeError;
  }> {
    return this.stripe.handleCardPayment(clientSecret, element, data);
  }

  /**
   * @deprecated
   */
  confirmPaymentIntent(
    clientSecret: string,
    element?,
    data?
  ): Observable<{
    paymentIntent?: StripeJS.PaymentIntent;
    error?: StripeJS.StripeError;
  }> {
    return this.stripe.confirmPaymentIntent(clientSecret, element, data);
  }

  /**
   * @deprecated
   */
  handleCardSetup(
    clientSecret: string,
    element?,
    data?
  ): Observable<{
    setupIntent?: StripeJS.SetupIntent;
    error?: StripeJS.StripeError;
  }> {
    return this.stripe.handleCardSetup(clientSecret, element, data);
  }

  /**
   * @deprecated
   */
  confirmSetupIntent(
    clientSecret: string,
    element?,
    data?
  ): Observable<{
    setupIntent?: StripeJS.SetupIntent;
    error?: StripeJS.StripeError;
  }> {
    return this.stripe.confirmSetupIntent(clientSecret, element, data);
  }

  /**
   * @deprecated
   */
  handleFpxPayment(
    clientSecret: string,
    element?,
    data?
  ): Observable<{
    setupIntent?: StripeJS.SetupIntent;
    error?: StripeJS.StripeError;
  }> {
    return this.stripe.handleFpxPayment(clientSecret, element, data);
  }
}
