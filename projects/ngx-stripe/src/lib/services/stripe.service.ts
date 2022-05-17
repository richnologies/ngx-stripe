import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import {
  ConfirmAcssDebitPaymentData,
  ConfirmAcssDebitPaymentOptions,
  ConfirmAfterpayClearpayPaymentData,
  ConfirmAfterpayClearpayPaymentOptions,
  ConfirmAlipayPaymentData,
  ConfirmAlipayPaymentOptions,
  ConfirmAuBecsDebitPaymentData,
  ConfirmAuBecsDebitSetupData,
  ConfirmBancontactPaymentData,
  ConfirmBancontactPaymentOptions,
  ConfirmBoletoPaymentData,
  ConfirmBoletoPaymentOptions,
  ConfirmCardPaymentData,
  ConfirmCardPaymentOptions,
  ConfirmEpsPaymentData,
  ConfirmEpsPaymentOptions,
  ConfirmFpxPaymentData,
  ConfirmFpxPaymentOptions,
  ConfirmGiropayPaymentData,
  ConfirmGiropayPaymentOptions,
  ConfirmGrabPayPaymentData,
  ConfirmGrabPayPaymentOptions,
  ConfirmIdealPaymentData,
  ConfirmIdealPaymentOptions,
  ConfirmKlarnaPaymentData,
  ConfirmKlarnaPaymentOptions,
  ConfirmOxxoPaymentData,
  ConfirmOxxoPaymentOptions,
  ConfirmP24PaymentData,
  ConfirmP24PaymentOptions,
  ConfirmCardSetupData,
  ConfirmCardSetupOptions,
  ConfirmSepaDebitPaymentData,
  ConfirmSofortPaymentData,
  ConfirmWechatPayPaymentData,
  ConfirmWechatPayPaymentOptions,
  ConfirmSepaDebitSetupData,
  CreatePaymentMethodData,
  VerifyMicrodepositsForPaymentData,
  ConfirmAcssDebitSetupData,
  ConfirmAcssDebitSetupOptions,
  CreateSourceData,
  CreateTokenIbanData,
  CreateTokenCardData,
  CreateTokenPiiData,
  CreateTokenBankAccountData,
  PaymentIntent,
  PaymentMethod,
  PaymentRequest,
  PaymentRequestOptions,
  RedirectToCheckoutOptions,
  RetrieveSourceParam,
  SetupIntent,
  Stripe,
  StripeCardElement,
  StripeCardNumberElement,
  StripeCardCvcElement,
  StripeConstructorOptions,
  StripeElements,
  StripeElementsOptions,
  StripeElement,
  StripeError,
  StripeIbanElement,
  Source,
  Token,
  TokenCreateParams,
  ConfirmBacsDebitSetupData,
  ConfirmBancontactSetupData,
  ConfirmIdealSetupData,
  ConfirmSofortSetupData,
  VerifyMicrodepositsForSetupData,
  VerificationSessionResult,
  ConfirmPayPalPaymentData,
  ConfirmPayPalSetupData,
  ConfirmPaymentData,
  ConfirmCustomerBalancePaymentData,
  ConfirmCustomerBalancePaymentOptions,
  ConfirmPayNowPaymentData,
  ConfirmPayNowPaymentOptions,
  ConfirmPromptPayPaymentData,
  ConfirmPromptPayPaymentOptions,
  ConfirmAffirmPaymentData,
  ConfirmAffirmPaymentOptions,
  ConfirmSofortPaymentOptions,
  ConfirmSofortSetupOptions,
  ConfirmKonbiniPaymentData,
  ConfirmKonbiniPaymentOptions,
  ConfirmUsBankAccountPaymentData,
  CollectBankAccountForPaymentOptions,
  ConfirmUsBankAccountSetupData,
  CollectBankAccountForSetupOptions
} from '@stripe/stripe-js';

import { STRIPE_PUBLISHABLE_KEY, STRIPE_OPTIONS, NGX_STRIPE_VERSION } from '../interfaces/ngx-stripe.interface';
import { StripeServiceInterface } from '../interfaces/stripe-instance.interface';

import { WindowRef } from './window-ref.service';
import { LazyStripeAPILoader, LazyStripeAPILoaderStatus } from './api-loader.service';

import { StripeInstance } from './stripe-instance.class';

@Injectable()
export class StripeService implements StripeServiceInterface {
  stripe!: StripeInstance;

  constructor(
    @Inject(NGX_STRIPE_VERSION) public version: string,
    @Inject(STRIPE_PUBLISHABLE_KEY) public key: string,
    @Inject(STRIPE_OPTIONS) public options: StripeConstructorOptions,
    public loader: LazyStripeAPILoader,
    public window: WindowRef
  ) {
    if (key) {
      this.stripe = new StripeInstance(this.version, this.loader, this.window, key, options);
    }
  }

  getStripeReference(): Observable<any> {
    return this.loader.asStream().pipe(
      filter((status: LazyStripeAPILoaderStatus) => status.loaded === true),
      map(() => (this.window.getNativeWindow() as any).Stripe)
    );
  }

  getInstance(): Stripe | undefined {
    return this.stripe.getInstance();
  }

  setKey(key: string, options?: StripeConstructorOptions) {
    return this.changeKey(key, options);
  }

  changeKey(key: string, options?: StripeConstructorOptions) {
    this.stripe = new StripeInstance(this.version, this.loader, this.window, key, options);

    return this.stripe;
  }

  elements(options?: StripeElementsOptions): Observable<StripeElements> {
    return this.stripe.elements(options);
  }

  redirectToCheckout(options?: RedirectToCheckoutOptions): Observable<never | { error: StripeError }> {
    return this.stripe.redirectToCheckout(options);
  }

  confirmPayment(options: {
    elements: StripeElements;
    confirmParams?: Partial<ConfirmPaymentData>;
    redirect: 'if_required';
  }): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }>;
  confirmPayment(options: {
    elements: StripeElements;
    confirmParams: ConfirmPaymentData;
    redirect?: 'always';
  }): Observable<never | { error: StripeError }>;
  confirmPayment(options) {
    return this.stripe.confirmPayment(options);
  }

  confirmAcssDebitPayment(
    clientSecret: string,
    data?: ConfirmAcssDebitPaymentData,
    options?: ConfirmAcssDebitPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmAcssDebitPayment(clientSecret, data, options);
  }

  confirmUsBankAccountPayment(
    clientSecret: string,
    data?: ConfirmUsBankAccountPaymentData
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmUsBankAccountPayment(clientSecret, data);
  }

  confirmAlipayPayment(
    clientSecret: string,
    data?: ConfirmAlipayPaymentData,
    options?: ConfirmAlipayPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmAlipayPayment(clientSecret, data, options);
  }

  confirmAuBecsDebitPayment(
    clientSecret: string,
    data?: ConfirmAuBecsDebitPaymentData
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmAuBecsDebitPayment(clientSecret, data);
  }

  confirmBancontactPayment(
    clientSecret: string,
    data?: ConfirmBancontactPaymentData,
    options?: ConfirmBancontactPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmBancontactPayment(clientSecret, data, options);
  }

  confirmBoletoPayment(
    clientSecret: string,
    data?: ConfirmBoletoPaymentData,
    options?: ConfirmBoletoPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmBoletoPayment(clientSecret, data, options);
  }

  confirmCardPayment(
    clientSecret: string,
    data?: ConfirmCardPaymentData,
    options?: ConfirmCardPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmCardPayment(clientSecret, data, options);
  }

  confirmCustomerBalancePayment(
    clientSecret: string,
    data?: ConfirmCustomerBalancePaymentData,
    options?: ConfirmCustomerBalancePaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmCustomerBalancePayment(clientSecret, data, options);
  }

  confirmEpsPayment(
    clientSecret: string,
    data?: ConfirmEpsPaymentData,
    options?: ConfirmEpsPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmEpsPayment(clientSecret, data, options);
  }

  confirmFpxPayment(
    clientSecret: string,
    data?: ConfirmFpxPaymentData,
    options?: ConfirmFpxPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmFpxPayment(clientSecret, data, options);
  }

  confirmGiropayPayment(
    clientSecret: string,
    data?: ConfirmGiropayPaymentData,
    options?: ConfirmGiropayPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmGiropayPayment(clientSecret, data, options);
  }

  confirmGrabPayPayment(
    clientSecret: string,
    data?: ConfirmGrabPayPaymentData,
    options?: ConfirmGrabPayPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmGrabPayPayment(clientSecret, data, options);
  }

  confirmIdealPayment(
    clientSecret: string,
    data?: ConfirmIdealPaymentData,
    options?: ConfirmIdealPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmIdealPayment(clientSecret, data, options);
  }

  confirmKlarnaPayment(
    clientSecret: string,
    data?: ConfirmKlarnaPaymentData,
    options?: ConfirmKlarnaPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmKlarnaPayment(clientSecret, data, options);
  }

  confirmKonbiniPayment(
    clientSecret: string,
    data?: ConfirmKonbiniPaymentData,
    options?: ConfirmKonbiniPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmKonbiniPayment(clientSecret, data, options);
  }

  confirmOxxoPayment(
    clientSecret: string,
    data?: ConfirmOxxoPaymentData,
    options?: ConfirmOxxoPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmOxxoPayment(clientSecret, data, options);
  }

  confirmP24Payment(
    clientSecret: string,
    data?: ConfirmP24PaymentData,
    options?: ConfirmP24PaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmP24Payment(clientSecret, data, options);
  }

  confirmPayNowPayment(
    clientSecret: string,
    data?: ConfirmPayNowPaymentData,
    options?: ConfirmPayNowPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmPayNowPayment(clientSecret, data, options);
  }

  confirmPayPalPayment(
    clientSecret: string,
    data?: ConfirmPayPalPaymentData
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmPayPalPayment(clientSecret, data);
  }

  confirmPromptPayPayment(
    clientSecret: string,
    data?: ConfirmPromptPayPaymentData,
    options?: ConfirmPromptPayPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmPromptPayPayment(clientSecret, data, options);
  }

  confirmSepaDebitPayment(
    clientSecret: string,
    data?: ConfirmSepaDebitPaymentData
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmSepaDebitPayment(clientSecret, data);
  }

  confirmSofortPayment(
    clientSecret: string,
    data?: ConfirmSofortPaymentData,
    options?: ConfirmSofortPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmSofortPayment(clientSecret, data, options);
  }

  confirmWechatPayPayment(
    clientSecret: string,
    data?: ConfirmWechatPayPaymentData,
    options?: ConfirmWechatPayPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmWechatPayPayment(clientSecret, data, options);
  }

  handleCardAction(clientSecret: string): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }> {
    return this.stripe.handleCardAction(clientSecret);
  }

  verifyMicrodepositsForPayment(
    clientSecret: string,
    data?: VerifyMicrodepositsForPaymentData
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }> {
    return this.stripe.verifyMicrodepositsForPayment(clientSecret, data);
  }

  collectBankAccountForPayment(options: CollectBankAccountForPaymentOptions): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }> {
    return this.stripe.collectBankAccountForPayment(options);
  }

  createPaymentMethod(paymentMethodData: CreatePaymentMethodData): Observable<{
    paymentMethod?: PaymentMethod;
    error?: StripeError;
  }> {
    return this.stripe.createPaymentMethod(paymentMethodData);
  }

  retrievePaymentIntent(clientSecret: string): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }> {
    return this.stripe.retrievePaymentIntent(clientSecret);
  }

  confirmSetup(options: {
    elements: StripeElements;
    confirmParams?: Partial<ConfirmPaymentData>;
    redirect: 'if_required';
  }): Observable<{
    setupIntent?: SetupIntent;
    error?: StripeError;
  }>;
  confirmSetup(options: {
    elements: StripeElements;
    confirmParams: ConfirmPaymentData;
    redirect?: 'always';
  }): Observable<never | { error: StripeError }>;
  confirmSetup(options) {
    return this.stripe.confirmSetup(options);
  }

  confirmAcssDebitSetup(
    clientSecret: string,
    data?: ConfirmAcssDebitSetupData,
    options?: ConfirmAcssDebitSetupOptions
  ): Observable<{
    setupIntent?: SetupIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmAcssDebitSetup(clientSecret, data, options);
  }

  confirmUsBankAccountSetup(
    clientSecret: string,
    data?: ConfirmUsBankAccountSetupData
  ): Observable<{
    setupIntent?: SetupIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmUsBankAccountSetup(clientSecret, data);
  }

  confirmAuBecsDebitSetup(
    clientSecret: string,
    data?: ConfirmAuBecsDebitSetupData
  ): Observable<{
    setupIntent?: SetupIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmAuBecsDebitSetup(clientSecret, data);
  }

  confirmBacsDebitSetup(
    clientSecret: string,
    data?: ConfirmBacsDebitSetupData
  ): Observable<{
    setupIntent?: SetupIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmBacsDebitSetup(clientSecret, data);
  }

  confirmBancontactSetup(
    clientSecret: string,
    data?: ConfirmBancontactSetupData
  ): Observable<{
    setupIntent?: SetupIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmBancontactSetup(clientSecret, data);
  }

  confirmCardSetup(
    clientSecret: string,
    data?: ConfirmCardSetupData,
    options?: ConfirmCardSetupOptions
  ): Observable<{
    setupIntent?: SetupIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmCardSetup(clientSecret, data, options);
  }

  confirmIdealSetup(
    clientSecret: string,
    data?: ConfirmIdealSetupData
  ): Observable<{
    setupIntent?: SetupIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmIdealSetup(clientSecret, data);
  }

  confirmPayPalSetup(
    clientSecret: string,
    data?: ConfirmPayPalSetupData
  ): Observable<{
    setupIntent?: SetupIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmPayPalSetup(clientSecret, data);
  }

  confirmSepaDebitSetup(
    clientSecret: string,
    data?: ConfirmSepaDebitSetupData
  ): Observable<{
    setupIntent?: SetupIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmSepaDebitSetup(clientSecret, data);
  }

  confirmSofortSetup(
    clientSecret: string,
    data?: ConfirmSofortSetupData,
    options?: ConfirmSofortSetupOptions
  ): Observable<{
    setupIntent?: SetupIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmSofortSetup(clientSecret, data, options);
  }

  confirmAffirmPayment(
    clientSecret: string,
    data?: ConfirmAffirmPaymentData,
    options?: ConfirmAffirmPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmAffirmPayment(clientSecret, data, options);
  }

  confirmAfterpayClearpayPayment(
    clientSecret: string,
    data?: ConfirmAfterpayClearpayPaymentData,
    options?: ConfirmAfterpayClearpayPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }> {
    return this.stripe.confirmAfterpayClearpayPayment(clientSecret, data, options);
  }

  verifyMicrodepositsForSetup(
    clientSecret: string,
    data?: VerifyMicrodepositsForSetupData
  ): Observable<{
    setupIntent?: SetupIntent;
    error?: StripeError;
  }> {
    return this.stripe.verifyMicrodepositsForSetup(clientSecret, data);
  }

  collectBankAccountForSetup(options?: CollectBankAccountForSetupOptions): Observable<{
    setupIntent?: SetupIntent;
    error?: StripeError;
  }> {
    return this.stripe.collectBankAccountForSetup(options);
  }

  retrieveSetupIntent(clientSecret: string): Observable<{
    setupIntent?: SetupIntent;
    error?: StripeError;
  }> {
    return this.stripe.retrieveSetupIntent(clientSecret);
  }

  paymentRequest(options: PaymentRequestOptions): PaymentRequest | undefined {
    return this.stripe.paymentRequest(options);
  }

  createToken(
    tokenType: StripeIbanElement,
    data: CreateTokenIbanData
  ): Observable<{ token?: Token; error?: StripeError }>;
  createToken(
    tokenType: StripeCardElement | StripeCardNumberElement,
    data?: CreateTokenCardData
  ): Observable<{ token?: Token; error?: StripeError }>;
  createToken(tokenType: 'pii', data: CreateTokenPiiData): Observable<{ token?: Token; error?: StripeError }>;
  createToken(
    tokenType: 'bank_account',
    data: CreateTokenBankAccountData
  ): Observable<{ token?: Token; error?: StripeError }>;
  createToken(
    tokenType: 'cvc_update',
    element?: StripeCardCvcElement
  ): Observable<{ token?: Token; error?: StripeError }>;
  createToken(
    tokenType: 'account',
    data: TokenCreateParams.Account
  ): Observable<{ token?: Token; error?: StripeError }>;
  createToken(tokenType: 'person', data: TokenCreateParams.Person): Observable<{ token?: Token; error?: StripeError }>;
  createToken(tokenType, data) {
    return this.stripe.createToken(tokenType, data);
  }

  createSource(
    element: StripeElement,
    sourceData: CreateSourceData
  ): Observable<{ source?: Source; error?: StripeError }>;
  createSource(sourceData: CreateSourceData): Observable<{ source?: Source; error?: StripeError }>;
  createSource(a, b?): Observable<{ source?: Source; error?: StripeError }> {
    return this.stripe.createSource(a, b);
  }

  retrieveSource(source: RetrieveSourceParam): Observable<{ source?: Source; error?: StripeError }> {
    return this.stripe.retrieveSource(source);
  }

  verifyIdentity(clientSecret: string): Observable<VerificationSessionResult> {
    return this.stripe.verifyIdentity(clientSecret);
  }

  /**
   * @deprecated
   */
  handleCardPayment(
    clientSecret: string,
    element?,
    data?
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
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
    paymentIntent?: PaymentIntent;
    error?: StripeError;
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
    setupIntent?: SetupIntent;
    error?: StripeError;
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
    setupIntent?: SetupIntent;
    error?: StripeError;
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
    setupIntent?: SetupIntent;
    error?: StripeError;
  }> {
    return this.stripe.handleFpxPayment(clientSecret, element, data);
  }
}
