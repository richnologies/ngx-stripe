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
  PaymentRequest,
  PaymentRequestOptions,
  RedirectToCheckoutOptions,
  RetrieveSourceParam,
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
  CollectBankAccountForSetupOptions,
  ConfirmPixPaymentData,
  ConfirmPixPaymentOptions,
  PaymentIntentResult,
  PaymentMethodResult,
  SetupIntentResult,
  ProcessOrderResult,
  RetrieveOrderResult,
  TokenResult,
  SourceResult,
  FinancialConnectionsSessionResult,
  CollectBankAccountTokenResult,
  EphemeralKeyNonceResult,
  RadarSessionPayload,
  ProcessOrderParams,
  CollectFinancialConnectionsAccountsOptions,
  CollectBankAccountTokenOptions,
  EphemeralKeyNonceOptions,
  StripeElementsOptionsClientSecret,
  StripeElementsOptionsMode,
  ConfirmBlikPaymentData,
  ConfirmBlikPaymentOptions,
  ConfirmCashappPaymentData,
  ConfirmCashappPaymentOptions,
  PaymentIntentOrSetupIntentResult,
  CreatePaymentMethodFromElements,
  CreatePaymentMethodFromElement,
  ConfirmCashappSetupData,
  ConfirmCashappSetupOptions,
  StripeCheckoutOptions,
  StripeCheckout,
  StripeEmbeddedCheckoutOptions,
  StripeEmbeddedCheckout,
  ConfirmMobilepayPaymentData,
  ConfirmMobilepayPaymentOptions,
  CreateConfirmationToken,
  ConfirmationTokenResult,
  ConfirmSetupData,
  ConfirmMultibancoPaymentOptions,
  ConfirmTwintPaymentData,
  ConfirmMultibancoPaymentData,
  ConfirmTwintPaymentOptions
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

  elements(options?: StripeElementsOptionsClientSecret): Observable<StripeElements>;
  elements(options?: StripeElementsOptionsMode): Observable<StripeElements>;
  elements(options?: StripeElementsOptions): Observable<StripeElements>;
  elements(options?): Observable<StripeElements> {
    return this.stripe.elements(options);
  }

  redirectToCheckout(options: RedirectToCheckoutOptions): Observable<never | { error: StripeError }> {
    return this.stripe.redirectToCheckout(options);
  }

  confirmPayment(options: {
    elements: StripeElements;
    confirmParams?: Partial<ConfirmPaymentData>;
    redirect: 'if_required';
  }): Observable<PaymentIntentResult>;
  confirmPayment(options: {
    elements?: StripeElements;
    clientSecret: string;
    confirmParams?: Partial<ConfirmPaymentData>;
    redirect: 'if_required';
  }): Observable<PaymentIntentResult>;
  confirmPayment(options: {
    elements: StripeElements;
    confirmParams: ConfirmPaymentData;
    redirect?: 'always';
  }): Observable<never | { error: StripeError }>;
  confirmPayment(options: {
    elements?: StripeElements;
    clientSecret: string;
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
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmAcssDebitPayment(clientSecret, data, options);
  }

  confirmUsBankAccountPayment(
    clientSecret: string,
    data?: ConfirmUsBankAccountPaymentData
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmUsBankAccountPayment(clientSecret, data);
  }

  confirmAlipayPayment(
    clientSecret: string,
    data?: ConfirmAlipayPaymentData,
    options?: ConfirmAlipayPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmAlipayPayment(clientSecret, data, options);
  }

  confirmAuBecsDebitPayment(
    clientSecret: string,
    data?: ConfirmAuBecsDebitPaymentData
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmAuBecsDebitPayment(clientSecret, data);
  }

  confirmBancontactPayment(
    clientSecret: string,
    data?: ConfirmBancontactPaymentData,
    options?: ConfirmBancontactPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmBancontactPayment(clientSecret, data, options);
  }

  confirmBlikPayment(
    clientSecret: string,
    data?: ConfirmBlikPaymentData,
    options?: ConfirmBlikPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmBlikPayment(clientSecret, data, options);
  }

  confirmBoletoPayment(
    clientSecret: string,
    data?: ConfirmBoletoPaymentData,
    options?: ConfirmBoletoPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmBoletoPayment(clientSecret, data, options);
  }

  confirmCardPayment(
    clientSecret: string,
    data?: ConfirmCardPaymentData,
    options?: ConfirmCardPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmCardPayment(clientSecret, data, options);
  }

  confirmCashappPayment(
    clientSecret: string,
    data?: ConfirmCashappPaymentData,
    options?: ConfirmCashappPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmCashappPayment(clientSecret, data, options);
  }

  confirmCustomerBalancePayment(
    clientSecret: string,
    data: ConfirmCustomerBalancePaymentData,
    options: ConfirmCustomerBalancePaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmCustomerBalancePayment(clientSecret, data, options);
  }

  confirmEpsPayment(
    clientSecret: string,
    data?: ConfirmEpsPaymentData,
    options?: ConfirmEpsPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmEpsPayment(clientSecret, data, options);
  }

  confirmFpxPayment(
    clientSecret: string,
    data?: ConfirmFpxPaymentData,
    options?: ConfirmFpxPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmFpxPayment(clientSecret, data, options);
  }

  confirmGiropayPayment(
    clientSecret: string,
    data?: ConfirmGiropayPaymentData,
    options?: ConfirmGiropayPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmGiropayPayment(clientSecret, data, options);
  }

  confirmGrabPayPayment(
    clientSecret: string,
    data?: ConfirmGrabPayPaymentData,
    options?: ConfirmGrabPayPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmGrabPayPayment(clientSecret, data, options);
  }

  confirmIdealPayment(
    clientSecret: string,
    data?: ConfirmIdealPaymentData,
    options?: ConfirmIdealPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmIdealPayment(clientSecret, data, options);
  }

  confirmKlarnaPayment(
    clientSecret: string,
    data?: ConfirmKlarnaPaymentData,
    options?: ConfirmKlarnaPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmKlarnaPayment(clientSecret, data, options);
  }

  confirmKonbiniPayment(
    clientSecret: string,
    data?: ConfirmKonbiniPaymentData,
    options?: ConfirmKonbiniPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmKonbiniPayment(clientSecret, data, options);
  }

  confirmMobilepayPayment(
    clientSecret: string,
    data?: ConfirmMobilepayPaymentData,
    options?: ConfirmMobilepayPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmMobilepayPayment(clientSecret, data, options);
  }

  confirmMultibancoPayment(
    clientSecret: string,
    data?: ConfirmMultibancoPaymentData,
    options?: ConfirmMultibancoPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmMultibancoPayment(clientSecret, data, options);
  }

  confirmOxxoPayment(
    clientSecret: string,
    data?: ConfirmOxxoPaymentData,
    options?: ConfirmOxxoPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmOxxoPayment(clientSecret, data, options);
  }

  confirmP24Payment(
    clientSecret: string,
    data?: ConfirmP24PaymentData,
    options?: ConfirmP24PaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmP24Payment(clientSecret, data, options);
  }

  confirmPayNowPayment(
    clientSecret: string,
    data?: ConfirmPayNowPaymentData,
    options?: ConfirmPayNowPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmPayNowPayment(clientSecret, data, options);
  }

  confirmPayPalPayment(clientSecret: string, data?: ConfirmPayPalPaymentData): Observable<PaymentIntentResult> {
    return this.stripe.confirmPayPalPayment(clientSecret, data);
  }

  confirmPixPayment(
    clientSecret: string,
    data?: ConfirmPixPaymentData,
    options?: ConfirmPixPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmPixPayment(clientSecret, data, options);
  }

  confirmPromptPayPayment(
    clientSecret: string,
    data?: ConfirmPromptPayPaymentData,
    options?: ConfirmPromptPayPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmPromptPayPayment(clientSecret, data, options);
  }

  confirmSepaDebitPayment(clientSecret: string, data?: ConfirmSepaDebitPaymentData): Observable<PaymentIntentResult> {
    return this.stripe.confirmSepaDebitPayment(clientSecret, data);
  }

  confirmSofortPayment(
    clientSecret: string,
    data?: ConfirmSofortPaymentData,
    options?: ConfirmSofortPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmSofortPayment(clientSecret, data, options);
  }

  confirmTwintPayment(
    clientSecret: string,
    data?: ConfirmTwintPaymentData,
    options?: ConfirmTwintPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmTwintPayment(clientSecret, data, options);
  }

  confirmWechatPayPayment(
    clientSecret: string,
    data?: ConfirmWechatPayPaymentData,
    options?: ConfirmWechatPayPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmWechatPayPayment(clientSecret, data, options);
  }

  handleCardAction(clientSecret: string): Observable<PaymentIntentResult> {
    return this.stripe.handleCardAction(clientSecret);
  }

  handleNextAction(options: { clientSecret: string }): Observable<PaymentIntentOrSetupIntentResult> {
    return this.stripe.handleNextAction(options);
  }

  verifyMicrodepositsForPayment(
    clientSecret: string,
    data?: VerifyMicrodepositsForPaymentData
  ): Observable<PaymentIntentResult> {
    return this.stripe.verifyMicrodepositsForPayment(clientSecret, data);
  }

  createRadarSession(): Observable<RadarSessionPayload> {
    return this.stripe.createRadarSession();
  }

  collectBankAccountForPayment(options: CollectBankAccountForPaymentOptions): Observable<PaymentIntentResult> {
    return this.stripe.collectBankAccountForPayment(options);
  }

  createPaymentMethod(paymentMethodData: CreatePaymentMethodData): Observable<PaymentMethodResult>;
  createPaymentMethod(options: CreatePaymentMethodFromElements): Observable<PaymentMethodResult>;
  createPaymentMethod(options: CreatePaymentMethodFromElement): Observable<PaymentMethodResult>;
  createPaymentMethod(options) {
    return this.stripe.createPaymentMethod(options);
  }

  createConfirmationToken(options: CreateConfirmationToken): Observable<ConfirmationTokenResult> {
    return this.stripe.createConfirmationToken(options);
  }

  retrievePaymentIntent(clientSecret: string): Observable<PaymentIntentResult> {
    return this.stripe.retrievePaymentIntent(clientSecret);
  }

  confirmSetup(options: {
    elements: StripeElements;
    confirmParams?: Partial<ConfirmSetupData>;
    redirect: 'if_required';
  }): Observable<SetupIntentResult>;
  confirmSetup(options: {
    elements?: StripeElements;
    clientSecret: string;
    confirmParams?: Partial<ConfirmSetupData>;
    redirect: 'if_required';
  }): Observable<SetupIntentResult>;
  confirmSetup(options: {
    elements: StripeElements;
    confirmParams: ConfirmSetupData;
    redirect?: 'always';
  }): Observable<never | { error: StripeError }>;
  confirmSetup(options: {
    elements?: StripeElements;
    clientSecret: string;
    confirmParams: ConfirmSetupData;
    redirect?: 'always';
  }): Observable<never | { error: StripeError }>;
  confirmSetup(options) {
    return this.stripe.confirmSetup(options);
  }

  confirmAcssDebitSetup(
    clientSecret: string,
    data?: ConfirmAcssDebitSetupData,
    options?: ConfirmAcssDebitSetupOptions
  ): Observable<SetupIntentResult> {
    return this.stripe.confirmAcssDebitSetup(clientSecret, data, options);
  }

  confirmUsBankAccountSetup(clientSecret: string, data?: ConfirmUsBankAccountSetupData): Observable<SetupIntentResult> {
    return this.stripe.confirmUsBankAccountSetup(clientSecret, data);
  }

  confirmAuBecsDebitSetup(clientSecret: string, data?: ConfirmAuBecsDebitSetupData): Observable<SetupIntentResult> {
    return this.stripe.confirmAuBecsDebitSetup(clientSecret, data);
  }

  confirmBacsDebitSetup(clientSecret: string, data?: ConfirmBacsDebitSetupData): Observable<SetupIntentResult> {
    return this.stripe.confirmBacsDebitSetup(clientSecret, data);
  }

  confirmBancontactSetup(clientSecret: string, data?: ConfirmBancontactSetupData): Observable<SetupIntentResult> {
    return this.stripe.confirmBancontactSetup(clientSecret, data);
  }

  confirmCardSetup(
    clientSecret: string,
    data?: ConfirmCardSetupData,
    options?: ConfirmCardSetupOptions
  ): Observable<SetupIntentResult> {
    return this.stripe.confirmCardSetup(clientSecret, data, options);
  }

  confirmCashappSetup(
    clientSecret: string,
    data?: ConfirmCashappSetupData,
    options?: ConfirmCashappSetupOptions
  ): Observable<SetupIntentResult> {
    return this.stripe.confirmCashappSetup(clientSecret, data, options);
  }

  confirmIdealSetup(clientSecret: string, data?: ConfirmIdealSetupData): Observable<SetupIntentResult> {
    return this.stripe.confirmIdealSetup(clientSecret, data);
  }

  confirmPayPalSetup(clientSecret: string, data?: ConfirmPayPalSetupData): Observable<SetupIntentResult> {
    return this.stripe.confirmPayPalSetup(clientSecret, data);
  }

  confirmSepaDebitSetup(clientSecret: string, data?: ConfirmSepaDebitSetupData): Observable<SetupIntentResult> {
    return this.stripe.confirmSepaDebitSetup(clientSecret, data);
  }

  confirmSofortSetup(
    clientSecret: string,
    data?: ConfirmSofortSetupData,
    options?: ConfirmSofortSetupOptions
  ): Observable<SetupIntentResult> {
    return this.stripe.confirmSofortSetup(clientSecret, data, options);
  }

  confirmAffirmPayment(
    clientSecret: string,
    data?: ConfirmAffirmPaymentData,
    options?: ConfirmAffirmPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmAffirmPayment(clientSecret, data, options);
  }

  confirmAfterpayClearpayPayment(
    clientSecret: string,
    data?: ConfirmAfterpayClearpayPaymentData,
    options?: ConfirmAfterpayClearpayPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.confirmAfterpayClearpayPayment(clientSecret, data, options);
  }

  verifyMicrodepositsForSetup(
    clientSecret: string,
    data?: VerifyMicrodepositsForSetupData
  ): Observable<SetupIntentResult> {
    return this.stripe.verifyMicrodepositsForSetup(clientSecret, data);
  }

  collectBankAccountForSetup(options: CollectBankAccountForSetupOptions): Observable<SetupIntentResult> {
    return this.stripe.collectBankAccountForSetup(options);
  }

  retrieveSetupIntent(clientSecret: string): Observable<SetupIntentResult> {
    return this.stripe.retrieveSetupIntent(clientSecret);
  }

  processOrder(options: {
    elements: StripeElements;
    confirmParams?: Partial<ProcessOrderParams>;
    redirect: 'if_required';
  }): Observable<ProcessOrderResult>;
  processOrder(options: {
    elements: StripeElements;
    confirmParams: ProcessOrderParams;
    redirect?: 'always';
  }): Observable<never | { error: StripeError }>;
  processOrder(options) {
    return this.stripe.processOrder(options);
  }

  retrieveOrder(clientSecret: string): Observable<RetrieveOrderResult> {
    return this.stripe.retrieveOrder(clientSecret);
  }

  paymentRequest(options: PaymentRequestOptions): PaymentRequest {
    return this.stripe.paymentRequest(options);
  }

  createToken(tokenType: StripeIbanElement, data: CreateTokenIbanData): Observable<TokenResult>;
  createToken(
    tokenType: StripeCardElement | StripeCardNumberElement,
    data?: CreateTokenCardData
  ): Observable<TokenResult>;
  createToken(tokenType: 'pii', data: CreateTokenPiiData): Observable<TokenResult>;
  createToken(tokenType: 'bank_account', data: CreateTokenBankAccountData): Observable<TokenResult>;
  createToken(tokenType: 'cvc_update', element?: StripeCardCvcElement): Observable<TokenResult>;
  createToken(tokenType: 'account', data: TokenCreateParams.Account): Observable<TokenResult>;
  createToken(tokenType: 'person', data: TokenCreateParams.Person): Observable<TokenResult>;
  createToken(tokenType, data) {
    return this.stripe.createToken(tokenType, data);
  }

  createSource(element: StripeElement, sourceData: CreateSourceData): Observable<SourceResult>;
  createSource(sourceData: CreateSourceData): Observable<SourceResult>;
  createSource(a, b?): Observable<SourceResult> {
    return this.stripe.createSource(a, b);
  }

  retrieveSource(source: RetrieveSourceParam): Observable<SourceResult> {
    return this.stripe.retrieveSource(source);
  }

  verifyIdentity(clientSecret: string): Observable<VerificationSessionResult> {
    return this.stripe.verifyIdentity(clientSecret);
  }

  collectFinancialConnectionsAccounts(
    options: CollectFinancialConnectionsAccountsOptions
  ): Observable<FinancialConnectionsSessionResult> {
    return this.stripe.collectFinancialConnectionsAccounts(options);
  }

  collectBankAccountToken(options: CollectBankAccountTokenOptions): Observable<CollectBankAccountTokenResult> {
    return this.stripe.collectBankAccountToken(options);
  }

  createEphemeralKeyNonce(options: EphemeralKeyNonceOptions): Observable<EphemeralKeyNonceResult> {
    return this.stripe.createEphemeralKeyNonce(options);
  }

  initCheckout(options: StripeCheckoutOptions): Observable<StripeCheckout> {
    return this.stripe.initCheckout(options);
  }

  initEmbeddedCheckout(options: StripeEmbeddedCheckoutOptions): Observable<StripeEmbeddedCheckout> {
    return this.stripe.initEmbeddedCheckout(options);
  }

  /**
   * @deprecated
   */
  handleCardPayment(clientSecret: string, element?, data?): Observable<PaymentIntentResult> {
    return this.stripe.handleCardPayment(clientSecret, element, data);
  }

  /**
   * @deprecated
   */
  confirmPaymentIntent(clientSecret: string, element?, data?): Observable<PaymentIntentResult> {
    return this.stripe.confirmPaymentIntent(clientSecret, element, data);
  }

  /**
   * @deprecated
   */
  handleCardSetup(clientSecret: string, element?, data?): Observable<SetupIntentResult> {
    return this.stripe.handleCardSetup(clientSecret, element, data);
  }

  /**
   * @deprecated
   */
  confirmSetupIntent(clientSecret: string, element?, data?): Observable<SetupIntentResult> {
    return this.stripe.confirmSetupIntent(clientSecret, element, data);
  }

  /**
   * @deprecated
   */
  handleFpxPayment(clientSecret: string, element?, data?): Observable<SetupIntentResult> {
    return this.stripe.handleFpxPayment(clientSecret, element, data);
  }
}
