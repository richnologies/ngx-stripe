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
  StripeElements,
  StripeElementsOptions,
  StripeElement,
  StripeError,
  StripeIbanElement,
  Source,
  Token,
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
  ConfirmSofortSetupOptions
} from '@stripe/stripe-js';

export interface StripeServiceInterface {
  getInstance(): Stripe | undefined;
  elements(options?: StripeElementsOptions): Observable<StripeElements>;
  redirectToCheckout(
    options?: RedirectToCheckoutOptions
  ): Observable<never | { error: StripeError }>;
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
  }): Observable<never | {error: StripeError}>;
  confirmAcssDebitPayment(
    clientSecret: string,
    data?: ConfirmAcssDebitPaymentData,
    options?: ConfirmAcssDebitPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }>;
  confirmAlipayPayment(
    clientSecret: string,
    data?: ConfirmAlipayPaymentData,
    options?: ConfirmAlipayPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }>;
  confirmAuBecsDebitPayment(
    clientSecret: string,
    data?: ConfirmAuBecsDebitPaymentData
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }>;
  confirmBancontactPayment(
    clientSecret: string,
    data?: ConfirmBancontactPaymentData,
    options?: ConfirmBancontactPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }>;
  confirmCardPayment(
    clientSecret: string,
    data?: ConfirmCardPaymentData,
    options?: ConfirmCardPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }>;
  confirmCustomerBalancePayment(
    clientSecret: string,
    data?: ConfirmCustomerBalancePaymentData,
    options?: ConfirmCustomerBalancePaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }>;
  confirmEpsPayment(
    clientSecret: string,
    data?: ConfirmEpsPaymentData,
    options?: ConfirmEpsPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }>;
  confirmFpxPayment(
    clientSecret: string,
    data?: ConfirmFpxPaymentData,
    options?: ConfirmFpxPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }>;
  confirmGiropayPayment(
    clientSecret: string,
    data?: ConfirmGiropayPaymentData,
    options?: ConfirmGiropayPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }>;
  confirmGrabPayPayment(
    clientSecret: string,
    data?: ConfirmGrabPayPaymentData,
    options?: ConfirmGrabPayPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }>;
  confirmIdealPayment(
    clientSecret: string,
    data?: ConfirmIdealPaymentData,
    options?: ConfirmIdealPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }>;
  confirmKlarnaPayment(
    clientSecret: string,
    data?: ConfirmKlarnaPaymentData,
    options?: ConfirmKlarnaPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }>;
  confirmOxxoPayment(
    clientSecret: string,
    data?: ConfirmOxxoPaymentData,
    options?: ConfirmOxxoPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }>;
  confirmP24Payment(
    clientSecret: string,
    data?: ConfirmP24PaymentData,
    options?: ConfirmP24PaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }>;
  confirmPayNowPayment(
    clientSecret: string,
    data?: ConfirmPayNowPaymentData,
    options?: ConfirmPayNowPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }>;
  confirmPayPalPayment(
    clientSecret: string,
    data?: ConfirmPayPalPaymentData
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }>;
  confirmPromptPayPayment(
    clientSecret: string,
    data?: ConfirmPromptPayPaymentData,
    options?: ConfirmPromptPayPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }>;
  confirmSepaDebitPayment(
    clientSecret: string,
    data?: ConfirmSepaDebitPaymentData
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }>;
  confirmSofortPayment(
    clientSecret: string,
    data?: ConfirmSofortPaymentData,
    options?: ConfirmSofortPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }>;
  confirmWechatPayPayment(
    clientSecret: string,
    data?: ConfirmWechatPayPaymentData,
    options?: ConfirmWechatPayPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }>;
  handleCardAction(
    clientSecret: string
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }>;
  verifyMicrodepositsForPayment(
    clientSecret: string,
    data?: VerifyMicrodepositsForPaymentData
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }>;
  createPaymentMethod(
    paymentMethodData: CreatePaymentMethodData
  ): Observable<{
    paymentMethod?: PaymentMethod;
    error?: StripeError;
  }>;
  retrievePaymentIntent(
    clientSecret: string
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }>;
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
  confirmAcssDebitSetup(
    clientSecret: string,
    data?: ConfirmAcssDebitSetupData,
    options?: ConfirmAcssDebitSetupOptions
  ): Observable<{
    setupIntent?: SetupIntent;
    error?: StripeError;
  }>;
  confirmAuBecsDebitSetup(
    clientSecret: string,
    data?: ConfirmAuBecsDebitSetupData
  ): Observable<{
    setupIntent?: SetupIntent;
    error?: StripeError;
  }>;
  confirmBacsDebitSetup(
    clientSecret: string,
    data?: ConfirmBacsDebitSetupData
  ): Observable<{
    setupIntent?: SetupIntent;
    error?: StripeError;
  }>;
  confirmBancontactSetup(
    clientSecret: string,
    data?: ConfirmBancontactSetupData
  ): Observable<{
    setupIntent?: SetupIntent;
    error?: StripeError;
  }>;
  confirmCardSetup(
    clientSecret: string,
    data?: ConfirmCardSetupData,
    options?: ConfirmCardSetupOptions
  ): Observable<{
    setupIntent?: SetupIntent;
    error?: StripeError;
  }>;
  confirmIdealSetup(
    clientSecret: string,
    data?: ConfirmIdealSetupData
  ): Observable<{
    setupIntent?: SetupIntent;
    error?: StripeError;
  }>;
  confirmPayPalSetup(
    clientSecret: string,
    data?: ConfirmPayPalSetupData
  ): Observable<{
    setupIntent?: SetupIntent;
    error?: StripeError;
  }>;
  confirmSepaDebitSetup(
    clientSecret: string,
    data?: ConfirmSepaDebitSetupData
  ): Observable<{
    setupIntent?: SetupIntent;
    error?: StripeError;
  }>;
  confirmSofortSetup(
    clientSecret: string,
    data?: ConfirmSofortSetupData,
    options?: ConfirmSofortSetupOptions
  ): Observable<{
    setupIntent?: SetupIntent;
    error?: StripeError;
  }>;
  confirmAffirmPayment(
    clientSecret: string,
    data?: ConfirmAffirmPaymentData,
    options?: ConfirmAffirmPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }>;
  confirmAfterpayClearpayPayment(
    clientSecret: string,
    data?: ConfirmAfterpayClearpayPaymentData,
    options?: ConfirmAfterpayClearpayPaymentOptions
  ): Observable<{
    paymentIntent?: PaymentIntent;
    error?: StripeError;
  }>;
  verifyMicrodepositsForSetup(
    clientSecret: string,
    data?: VerifyMicrodepositsForSetupData
  ): Observable<{
    setupIntent?: SetupIntent;
    error?: StripeError;
  }>;
  retrieveSetupIntent(
    clientSecret: string
  ): Observable<{
    setupIntent?: SetupIntent;
    error?: StripeError;
  }>;
  paymentRequest(options: PaymentRequestOptions): PaymentRequest | undefined;
  createToken(
    tokenType: StripeIbanElement,
    data: CreateTokenIbanData
  ): Observable<{ token?: Token; error?: StripeError }>;
  createToken(
    tokenType: StripeCardElement | StripeCardNumberElement,
    data?: CreateTokenCardData
  ): Observable<{ token?: Token; error?: StripeError }>;
  createToken(
    tokenType: 'pii',
    data: CreateTokenPiiData
  ): Observable<{ token?: Token; error?: StripeError }>;
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
  createToken(
    tokenType: 'person',
    data: TokenCreateParams.Person
  ): Observable<{ token?: Token; error?: StripeError }>;
  createSource(
    element: StripeElement,
    sourceData: CreateSourceData
  ): Observable<{ source?: Source; error?: StripeError }>;
  createSource(
    sourceData: CreateSourceData
  ): Observable<{ source?: Source; error?: StripeError }>;
  retrieveSource(
    source: RetrieveSourceParam
  ): Observable<{ source?: Source; error?: StripeError }>;
  verifyIdentity(clientSecret: string): Observable<VerificationSessionResult>;
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
