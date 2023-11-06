import { Observable } from 'rxjs';

import {
  ConfirmAuBecsDebitPaymentData,
  ConfirmAuBecsDebitSetupData,
  ConfirmBancontactPaymentData,
  ConfirmBancontactPaymentOptions,
  ConfirmCardPaymentData,
  ConfirmCardPaymentOptions,
  ConfirmEpsPaymentData,
  ConfirmEpsPaymentOptions,
  ConfirmFpxPaymentData,
  ConfirmFpxPaymentOptions,
  ConfirmGiropayPaymentData,
  ConfirmGiropayPaymentOptions,
  ConfirmIdealPaymentData,
  ConfirmIdealPaymentOptions,
  ConfirmP24PaymentData,
  ConfirmP24PaymentOptions,
  ConfirmCardSetupData,
  ConfirmCardSetupOptions,
  ConfirmSepaDebitPaymentData,
  ConfirmSepaDebitSetupData,
  CreatePaymentMethodData,
  CreateSourceData,
  CreateTokenIbanData,
  CreateTokenCardData,
  CreateTokenPiiData,
  CreateTokenBankAccountData,
  PaymentIntent,
  PaymentRequest,
  PaymentRequestOptions,
  RedirectToCheckoutOptions,
  RetrieveSourceParam,
  SetupIntent,
  Stripe,
  StripeCardElement,
  StripeCardNumberElement,
  StripeCardCvcElement,
  StripeElements,
  StripeElementsOptions,
  StripeElement,
  StripeError,
  StripeIbanElement,
  TokenCreateParams,
  ConfirmAcssDebitPaymentData,
  ConfirmAcssDebitPaymentOptions,
  ConfirmAfterpayClearpayPaymentData,
  ConfirmAfterpayClearpayPaymentOptions,
  ConfirmAlipayPaymentData,
  ConfirmGrabPayPaymentData,
  ConfirmGrabPayPaymentOptions,
  ConfirmKlarnaPaymentData,
  ConfirmKlarnaPaymentOptions,
  ConfirmOxxoPaymentData,
  ConfirmOxxoPaymentOptions,
  ConfirmSofortPaymentData,
  ConfirmWechatPayPaymentData,
  ConfirmWechatPayPaymentOptions,
  VerifyMicrodepositsForPaymentData,
  ConfirmAcssDebitSetupData,
  ConfirmAcssDebitSetupOptions,
  ConfirmBacsDebitSetupData,
  ConfirmBancontactSetupData,
  ConfirmIdealSetupData,
  ConfirmSofortSetupData,
  VerifyMicrodepositsForSetupData,
  ConfirmAlipayPaymentOptions,
  VerificationSessionResult,
  ConfirmPayPalPaymentData,
  ConfirmPayPalSetupData,
  ConfirmPaymentData,
  ConfirmAffirmPaymentData,
  ConfirmAffirmPaymentOptions,
  ConfirmPromptPayPaymentData,
  ConfirmPromptPayPaymentOptions,
  ConfirmPayNowPaymentData,
  ConfirmPayNowPaymentOptions,
  ConfirmCustomerBalancePaymentData,
  ConfirmCustomerBalancePaymentOptions,
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
  RadarSessionPayload,
  ProcessOrderResult,
  RetrieveOrderResult,
  TokenResult,
  PaymentIntentResult,
  ConfirmBoletoPaymentData,
  ConfirmBoletoPaymentOptions,
  PaymentMethodResult,
  SetupIntentResult,
  SourceResult,
  FinancialConnectionsSessionResult,
  CollectBankAccountTokenResult,
  EphemeralKeyNonceResult,
  ProcessOrderParams,
  CollectFinancialConnectionsAccountsOptions,
  CollectBankAccountTokenOptions,
  EphemeralKeyNonceOptions,
  ConfirmBlikPaymentData,
  ConfirmBlikPaymentOptions,
  ConfirmCashappPaymentData,
  ConfirmCashappPaymentOptions,
  PaymentIntentOrSetupIntentResult,
  CreatePaymentMethodFromElements,
  CreatePaymentMethodFromElement,
  ConfirmCashappSetupData,
  ConfirmCashappSetupOptions,
  StripeElementsOptionsClientSecret,
  StripeCustomCheckoutOptions,
  StripeCustomCheckout,
  StripeEmbeddedCheckoutOptions,
  StripeEmbeddedCheckout
} from '@stripe/stripe-js';

export interface StripeServiceInterface {
  getInstance(): Stripe | undefined;
  elements(options?: StripeElementsOptionsClientSecret): Observable<StripeElements>;
  elements(options?: StripeElementsOptions): Observable<StripeElements>;
  redirectToCheckout(options?: RedirectToCheckoutOptions): Observable<never | { error: StripeError }>;
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
  }): Observable<never | {error: StripeError}>;
  confirmAcssDebitPayment(
    clientSecret: string,
    data?: ConfirmAcssDebitPaymentData,
    options?: ConfirmAcssDebitPaymentOptions
  ): Observable<PaymentIntentResult>;
  confirmUsBankAccountPayment(
    clientSecret: string,
    data?: ConfirmUsBankAccountPaymentData
  ): Observable<PaymentIntentResult>;
  confirmAlipayPayment(
    clientSecret: string,
    data?: ConfirmAlipayPaymentData,
    options?: ConfirmAlipayPaymentOptions
  ): Observable<PaymentIntentResult>;
  confirmAuBecsDebitPayment(
    clientSecret: string,
    data?: ConfirmAuBecsDebitPaymentData
  ): Observable<PaymentIntentResult>;
  confirmBancontactPayment(
    clientSecret: string,
    data?: ConfirmBancontactPaymentData,
    options?: ConfirmBancontactPaymentOptions
  ): Observable<PaymentIntentResult>;
  confirmBlikPayment(
    clientSecret: string,
    data: ConfirmBlikPaymentData,
    options?: ConfirmBlikPaymentOptions
  ): Observable<PaymentIntentResult>;
  confirmBoletoPayment(
    clientSecret: string,
    data?: ConfirmBoletoPaymentData,
    options?: ConfirmBoletoPaymentOptions
  ): Observable<PaymentIntentResult>;
  confirmCardPayment(
    clientSecret: string,
    data?: ConfirmCardPaymentData,
    options?: ConfirmCardPaymentOptions
  ): Observable<PaymentIntentResult>;
  confirmCashappPayment(
    clientSecret: string,
    data?: ConfirmCashappPaymentData,
    options?: ConfirmCashappPaymentOptions
  ): Observable<PaymentIntentResult>;
  confirmCustomerBalancePayment(
    clientSecret: string,
    data?: ConfirmCustomerBalancePaymentData,
    options?: ConfirmCustomerBalancePaymentOptions
  ): Observable<PaymentIntentResult>;
  confirmEpsPayment(
    clientSecret: string,
    data?: ConfirmEpsPaymentData,
    options?: ConfirmEpsPaymentOptions
  ): Observable<PaymentIntentResult>;
  confirmFpxPayment(
    clientSecret: string,
    data?: ConfirmFpxPaymentData,
    options?: ConfirmFpxPaymentOptions
  ): Observable<PaymentIntentResult>;
  confirmGiropayPayment(
    clientSecret: string,
    data?: ConfirmGiropayPaymentData,
    options?: ConfirmGiropayPaymentOptions
  ): Observable<PaymentIntentResult>;
  confirmGrabPayPayment(
    clientSecret: string,
    data?: ConfirmGrabPayPaymentData,
    options?: ConfirmGrabPayPaymentOptions
  ): Observable<PaymentIntentResult>;
  confirmIdealPayment(
    clientSecret: string,
    data?: ConfirmIdealPaymentData,
    options?: ConfirmIdealPaymentOptions
  ): Observable<PaymentIntentResult>;
  confirmKlarnaPayment(
    clientSecret: string,
    data?: ConfirmKlarnaPaymentData,
    options?: ConfirmKlarnaPaymentOptions
  ): Observable<PaymentIntentResult>;
  confirmKonbiniPayment(
    clientSecret: string,
    data?: ConfirmKonbiniPaymentData,
    options?: ConfirmKonbiniPaymentOptions
  ): Observable<PaymentIntentResult>;
  confirmOxxoPayment(
    clientSecret: string,
    data?: ConfirmOxxoPaymentData,
    options?: ConfirmOxxoPaymentOptions
  ): Observable<PaymentIntentResult>;
  confirmP24Payment(
    clientSecret: string,
    data?: ConfirmP24PaymentData,
    options?: ConfirmP24PaymentOptions
  ): Observable<PaymentIntentResult>;
  confirmPayNowPayment(
    clientSecret: string,
    data?: ConfirmPayNowPaymentData,
    options?: ConfirmPayNowPaymentOptions
  ): Observable<PaymentIntentResult>;
  confirmPayPalPayment(clientSecret: string, data?: ConfirmPayPalPaymentData): Observable<PaymentIntentResult>;
  confirmPixPayment(
    clientSecret: string,
    data?: ConfirmPixPaymentData,
    options?: ConfirmPixPaymentOptions
  ): Observable<PaymentIntentResult>;
  confirmPromptPayPayment(
    clientSecret: string,
    data?: ConfirmPromptPayPaymentData,
    options?: ConfirmPromptPayPaymentOptions
  ): Observable<PaymentIntentResult>;
  confirmSepaDebitPayment(clientSecret: string, data?: ConfirmSepaDebitPaymentData): Observable<PaymentIntentResult>;
  confirmSofortPayment(
    clientSecret: string,
    data?: ConfirmSofortPaymentData,
    options?: ConfirmSofortPaymentOptions
  ): Observable<PaymentIntentResult>;
  confirmWechatPayPayment(
    clientSecret: string,
    data?: ConfirmWechatPayPaymentData,
    options?: ConfirmWechatPayPaymentOptions
  ): Observable<PaymentIntentResult>;
  handleCardAction(clientSecret: string): Observable<PaymentIntentResult>;
  handleNextAction(options: { clientSecret: string; }): Observable<PaymentIntentOrSetupIntentResult>;
  verifyMicrodepositsForPayment(
    clientSecret: string,
    data?: VerifyMicrodepositsForPaymentData
  ): Observable<PaymentIntentResult>;
  createRadarSession(): Observable<RadarSessionPayload>;
  collectBankAccountForPayment(options: CollectBankAccountForPaymentOptions): Observable<PaymentIntentResult>;
  createPaymentMethod(paymentMethodData: CreatePaymentMethodData): Observable<PaymentMethodResult>;
  createPaymentMethod(options: CreatePaymentMethodFromElements): Observable<PaymentMethodResult>;
  createPaymentMethod(options: CreatePaymentMethodFromElement): Observable<PaymentMethodResult>;
  retrievePaymentIntent(clientSecret: string): Observable<PaymentIntentResult>;
  confirmSetup(options: {
    elements: StripeElements;
    confirmParams?: Partial<ConfirmPaymentData>;
    redirect: 'if_required';
  }): Observable<SetupIntentResult>;
  confirmSetup(options: {
    elements?: StripeElements;
    clientSecret: string;
    confirmParams?: Partial<ConfirmPaymentData>;
    redirect: 'if_required';
  }): Observable<SetupIntentResult>;
  confirmSetup(options: {
    elements: StripeElements;
    confirmParams: ConfirmPaymentData;
    redirect?: 'always';
  }): Observable<never | { error: StripeError }>;
  confirmSetup(options: {
    elements?: StripeElements;
    clientSecret: string;
    confirmParams: ConfirmPaymentData;
    redirect?: 'always';
  }): Observable<never | {error: StripeError}>;
  confirmAcssDebitSetup(
    clientSecret: string,
    data?: ConfirmAcssDebitSetupData,
    options?: ConfirmAcssDebitSetupOptions
  ): Observable<SetupIntentResult>;
  confirmUsBankAccountSetup(clientSecret: string, data?: ConfirmUsBankAccountSetupData): Observable<SetupIntentResult>;
  confirmAuBecsDebitSetup(clientSecret: string, data?: ConfirmAuBecsDebitSetupData): Observable<SetupIntentResult>;
  confirmBacsDebitSetup(clientSecret: string, data?: ConfirmBacsDebitSetupData): Observable<SetupIntentResult>;
  confirmBancontactSetup(clientSecret: string, data?: ConfirmBancontactSetupData): Observable<SetupIntentResult>;
  confirmCardSetup(
    clientSecret: string,
    data?: ConfirmCardSetupData,
    options?: ConfirmCardSetupOptions
  ): Observable<SetupIntentResult>;
  confirmCashappSetup(
    clientSecret: string,
    data?: ConfirmCashappSetupData,
    options?: ConfirmCashappSetupOptions
  ): Observable<SetupIntentResult>;
  confirmIdealSetup(clientSecret: string, data?: ConfirmIdealSetupData): Observable<SetupIntentResult>;
  confirmPayPalSetup(clientSecret: string, data?: ConfirmPayPalSetupData): Observable<SetupIntentResult>;
  confirmSepaDebitSetup(clientSecret: string, data?: ConfirmSepaDebitSetupData): Observable<SetupIntentResult>;
  confirmSofortSetup(
    clientSecret: string,
    data?: ConfirmSofortSetupData,
    options?: ConfirmSofortSetupOptions
  ): Observable<SetupIntentResult>;
  confirmAffirmPayment(
    clientSecret: string,
    data?: ConfirmAffirmPaymentData,
    options?: ConfirmAffirmPaymentOptions
  ): Observable<PaymentIntentResult>;
  confirmAfterpayClearpayPayment(
    clientSecret: string,
    data?: ConfirmAfterpayClearpayPaymentData,
    options?: ConfirmAfterpayClearpayPaymentOptions
  ): Observable<PaymentIntentResult>;
  verifyMicrodepositsForSetup(
    clientSecret: string,
    data?: VerifyMicrodepositsForSetupData
  ): Observable<SetupIntentResult>;
  collectBankAccountForSetup(options: CollectBankAccountForSetupOptions): Observable<SetupIntentResult>;
  retrieveSetupIntent(clientSecret: string): Observable<SetupIntentResult>;
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
  retrieveOrder(clientSecret: string): Observable<RetrieveOrderResult>;
  paymentRequest(options: PaymentRequestOptions): PaymentRequest;
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
  createSource(element: StripeElement, sourceData: CreateSourceData): Observable<SourceResult>;
  createSource(sourceData: CreateSourceData): Observable<SourceResult>;
  retrieveSource(source: RetrieveSourceParam): Observable<SourceResult>;
  verifyIdentity(clientSecret: string): Observable<VerificationSessionResult>;
  collectFinancialConnectionsAccounts(
    options: CollectFinancialConnectionsAccountsOptions
  ): Observable<FinancialConnectionsSessionResult>;
  collectBankAccountToken(options: CollectBankAccountTokenOptions): Observable<CollectBankAccountTokenResult>;
  createEphemeralKeyNonce(options: EphemeralKeyNonceOptions): Observable<EphemeralKeyNonceResult>;
  initCustomCheckout(options: StripeCustomCheckoutOptions): Observable<StripeCustomCheckout>;
  initEmbeddedCheckout(options: StripeEmbeddedCheckoutOptions): Observable<StripeEmbeddedCheckout>;
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
  }>;
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
  }>;
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
  }>;
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
  }>;
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
  }>;
}
