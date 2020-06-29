import { Observable } from 'rxjs';

import * as StripeJS from './stripejs.interface';

export interface StripeServiceInterface {
  getInstance(): StripeJS.Stripe | undefined;
  elements(
    options?: StripeJS.StripeElementsOptions
  ): Observable<StripeJS.StripeElements>;
  redirectToCheckout(
    options?: StripeJS.RedirectToCheckoutOptions
  ): Observable<never | { error: StripeJS.StripeError }>;
  confirmAuBecsDebitPayment(
    clientSecret: string,
    data?: StripeJS.ConfirmAuBecsDebitPaymentData
  ): Observable<{
    paymentIntent?: StripeJS.PaymentIntent;
    error?: StripeJS.StripeError;
  }>;
  confirmBancontactPayment(
    clientSecret: string,
    data?: StripeJS.ConfirmBancontactPaymentData,
    options?: StripeJS.ConfirmBancontactPaymentOptions
  ): Observable<{
    paymentIntent?: StripeJS.PaymentIntent;
    error?: StripeJS.StripeError;
  }>;
  confirmCardPayment(
    clientSecret: string,
    data?: StripeJS.ConfirmCardPaymentData,
    options?: StripeJS.ConfirmCardPaymentOptions
  ): Observable<{
    paymentIntent?: StripeJS.PaymentIntent;
    error?: StripeJS.StripeError;
  }>;
  confirmEpsPayment(
    clientSecret: string,
    data?: StripeJS.ConfirmEpsPaymentData,
    options?: StripeJS.ConfirmEpsPaymentOptions
  ): Observable<{
    paymentIntent?: StripeJS.PaymentIntent;
    error?: StripeJS.StripeError;
  }>;
  confirmFpxPayment(
    clientSecret: string,
    data?: StripeJS.ConfirmFpxPaymentData,
    options?: StripeJS.ConfirmFpxPaymentOptions
  ): Observable<{
    paymentIntent?: StripeJS.PaymentIntent;
    error?: StripeJS.StripeError;
  }>;
  confirmGiropayPayment(
    clientSecret: string,
    data?: StripeJS.ConfirmGiropayPaymentData,
    options?: StripeJS.ConfirmGiropayPaymentOptions
  ): Observable<{
    paymentIntent?: StripeJS.PaymentIntent;
    error?: StripeJS.StripeError;
  }>;
  confirmIdealPayment(
    clientSecret: string,
    data?: StripeJS.ConfirmIdealPaymentData,
    options?: StripeJS.ConfirmIdealPaymentOptions
  ): Observable<{
    paymentIntent?: StripeJS.PaymentIntent;
    error?: StripeJS.StripeError;
  }>;
  confirmP24Payment(
    clientSecret: string,
    data?: StripeJS.ConfirmP24PaymentData,
    options?: StripeJS.ConfirmP24PaymentOptions
  ): Observable<{
    paymentIntent?: StripeJS.PaymentIntent;
    error?: StripeJS.StripeError;
  }>;
  confirmSepaDebitPayment(
    clientSecret: string,
    data?: StripeJS.ConfirmSepaDebitPaymentData
  ): Observable<{
    paymentIntent?: StripeJS.PaymentIntent;
    error?: StripeJS.StripeError;
  }>;
  handleCardAction(
    clientSecret: string
  ): Observable<{
    paymentIntent?: StripeJS.PaymentIntent;
    error?: StripeJS.StripeError;
  }>;
  createPaymentMethod(
    paymentMethodData: StripeJS.CreatePaymentMethodData
  ): Observable<{
    paymentMethod?: StripeJS.PaymentMethod;
    error?: StripeJS.StripeError;
  }>;
  retrievePaymentIntent(
    clientSecret: string
  ): Observable<{
    paymentIntent?: StripeJS.PaymentIntent;
    error?: StripeJS.StripeError;
  }>;
  confirmAuBecsDebitSetup(
    clientSecret: string,
    data?: StripeJS.ConfirmAuBecsDebitSetupData
  ): Observable<{
    setupIntent?: StripeJS.SetupIntent;
    error?: StripeJS.StripeError;
  }>;
  confirmCardSetup(
    clientSecret: string,
    data?: StripeJS.ConfirmCardSetupData,
    options?: StripeJS.ConfirmCardSetupOptions
  ): Observable<{
    setupIntent?: StripeJS.SetupIntent;
    error?: StripeJS.StripeError;
  }>;
  confirmSepaDebitSetup(
    clientSecret: string,
    data?: StripeJS.ConfirmSepaDebitSetupData
  ): Observable<{
    setupIntent?: StripeJS.SetupIntent;
    error?: StripeJS.StripeError;
  }>;
  retrieveSetupIntent(
    clientSecret: string
  ): Observable<{
    setupIntent?: StripeJS.SetupIntent;
    error?: StripeJS.StripeError;
  }>;
  paymentRequest(
    options: StripeJS.PaymentRequestOptions
  ): StripeJS.PaymentRequest | undefined;
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
  createSource(
    element: StripeJS.StripeElement,
    sourceData: StripeJS.CreateSourceData
  ): Observable<{ source?: StripeJS.Source; error?: StripeJS.StripeError }>;
  createSource(
    sourceData: StripeJS.CreateSourceData
  ): Observable<{ source?: StripeJS.Source; error?: StripeJS.StripeError }>;
  retrieveSource(
    source: StripeJS.RetrieveSourceParam
  ): Observable<{ source?: StripeJS.Source; error?: StripeJS.StripeError }>;
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
  }>;
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
  }>;
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
  }>;
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
  }>;
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
  }>;
}
