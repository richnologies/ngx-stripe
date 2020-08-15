import { Observable } from 'rxjs/Observable';

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
  TokenCreateParams
} from '@stripe/stripe-js';

export interface StripeServiceInterface {
  getInstance(): Stripe | undefined;
  elements(options?: StripeElementsOptions): Observable<StripeElements>;
  redirectToCheckout(
    options?: RedirectToCheckoutOptions
  ): Observable<never | { error: StripeError }>;
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
  confirmIdealPayment(
    clientSecret: string,
    data?: ConfirmIdealPaymentData,
    options?: ConfirmIdealPaymentOptions
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
  confirmSepaDebitPayment(
    clientSecret: string,
    data?: ConfirmSepaDebitPaymentData
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
  confirmAuBecsDebitSetup(
    clientSecret: string,
    data?: ConfirmAuBecsDebitSetupData
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
  confirmSepaDebitSetup(
    clientSecret: string,
    data?: ConfirmSepaDebitSetupData
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
