import { BehaviorSubject, from, Observable } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';

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
  WrapperLibrary,
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
  PaymentIntentResult,
  PaymentMethodResult,
  SetupIntentResult,
  TokenResult,
  SourceResult,
  ConfirmPixPaymentData,
  ConfirmPixPaymentOptions,
  RadarSessionPayload,
  ProcessOrderResult,
  RetrieveOrderResult,
  FinancialConnectionsSessionResult,
  CollectBankAccountTokenResult,
  EphemeralKeyNonceResult
} from '@stripe/stripe-js';
import { ProcessOrderParams } from '@stripe/stripe-js/types/stripe-js/orders';
import {
  CollectBankAccountTokenOptions,
  CollectFinancialConnectionsAccountsOptions
} from '@stripe/stripe-js/types/stripe-js/financial-connections';
import { EphemeralKeyNonceOptions } from '@stripe/stripe-js/types/stripe-js/ephemeral-keys';

import { StripeServiceInterface } from '../interfaces/stripe-instance.interface';

import { WindowRef } from './window-ref.service';
import { LazyStripeAPILoader, LazyStripeAPILoaderStatus } from './api-loader.service';

export class StripeInstance implements StripeServiceInterface {
  private stripe$ = new BehaviorSubject<Stripe | undefined>(undefined);
  stripe = this.stripe$.asObservable().pipe(filter((stripe) => Boolean(stripe))) as Observable<Stripe>;

  constructor(
    private version: string,
    private loader: LazyStripeAPILoader,
    private window: WindowRef,
    private key: string,
    private options?: StripeConstructorOptions
  ) {
    this.loader
      .asStream()
      .pipe(
        filter((status: LazyStripeAPILoaderStatus) => status.loaded === true),
        first(),
        map(() => (this.window.getNativeWindow() as any).Stripe)
      )
      .subscribe((stripeInstance: any) => {
        const stripe = this.options
          ? (stripeInstance(this.key, this.options) as Stripe)
          : (stripeInstance(this.key) as Stripe);

        stripe.registerAppInfo(this.getNgxStripeAppInfo(this.version));
        this.stripe$.next(stripe);
      });
  }

  getInstance(): Stripe {
    return this.stripe$.getValue() as Stripe;
  }

  elements(options?: StripeElementsOptions): Observable<StripeElements> {
    return this.stripe.pipe(
      map((stripe: Stripe) => stripe.elements(options)),
      first()
    );
  }

  redirectToCheckout(options: RedirectToCheckoutOptions): Observable<never | { error: StripeError }> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.redirectToCheckout(options))),
      first()
    );
  }

  confirmPayment(options: {
    elements: StripeElements;
    confirmParams?: Partial<ConfirmPaymentData>;
    redirect: 'if_required';
  }): Observable<PaymentIntentResult>;
  confirmPayment(options: {
    elements: StripeElements;
    confirmParams: ConfirmPaymentData;
    redirect?: 'always';
  }): Observable<never | { error: StripeError }>;
  confirmPayment(options) {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmPayment(options))),
      first()
    );
  }

  confirmAcssDebitPayment(
    clientSecret: string,
    data?: ConfirmAcssDebitPaymentData,
    options?: ConfirmAcssDebitPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmAcssDebitPayment(clientSecret, data, options))),
      first()
    );
  }

  confirmUsBankAccountPayment(
    clientSecret: string,
    data?: ConfirmUsBankAccountPaymentData
  ): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmUsBankAccountPayment(clientSecret, data))),
      first()
    );
  }

  confirmAlipayPayment(
    clientSecret: string,
    data?: ConfirmAlipayPaymentData,
    options?: ConfirmAlipayPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmAlipayPayment(clientSecret, data, options))),
      first()
    );
  }

  confirmAuBecsDebitPayment(
    clientSecret: string,
    data?: ConfirmAuBecsDebitPaymentData
  ): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmAuBecsDebitPayment(clientSecret, data))),
      first()
    );
  }

  confirmBancontactPayment(
    clientSecret: string,
    data?: ConfirmBancontactPaymentData,
    options?: ConfirmBancontactPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmBancontactPayment(clientSecret, data, options))),
      first()
    );
  }

  confirmBoletoPayment(
    clientSecret: string,
    data?: ConfirmBoletoPaymentData,
    options?: ConfirmBoletoPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmBoletoPayment(clientSecret, data, options))),
      first()
    );
  }

  confirmCardPayment(
    clientSecret: string,
    data?: ConfirmCardPaymentData,
    options?: ConfirmCardPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmCardPayment(clientSecret, data, options))),
      first()
    );
  }

  confirmCustomerBalancePayment(
    clientSecret: string,
    data: ConfirmCustomerBalancePaymentData,
    options: ConfirmCustomerBalancePaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmCustomerBalancePayment(clientSecret, data, options))),
      first()
    );
  }

  confirmEpsPayment(
    clientSecret: string,
    data?: ConfirmEpsPaymentData,
    options?: ConfirmEpsPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmEpsPayment(clientSecret, data, options))),
      first()
    );
  }

  confirmFpxPayment(
    clientSecret: string,
    data?: ConfirmFpxPaymentData,
    options?: ConfirmFpxPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmFpxPayment(clientSecret, data, options))),
      first()
    );
  }

  confirmGiropayPayment(
    clientSecret: string,
    data?: ConfirmGiropayPaymentData,
    options?: ConfirmGiropayPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmGiropayPayment(clientSecret, data, options))),
      first()
    );
  }

  confirmGrabPayPayment(
    clientSecret: string,
    data?: ConfirmGrabPayPaymentData,
    options?: ConfirmGrabPayPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmGrabPayPayment(clientSecret, data, options))),
      first()
    );
  }

  confirmIdealPayment(
    clientSecret: string,
    data?: ConfirmIdealPaymentData,
    options?: ConfirmIdealPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmIdealPayment(clientSecret, data, options))),
      first()
    );
  }

  confirmKlarnaPayment(
    clientSecret: string,
    data?: ConfirmKlarnaPaymentData,
    options?: ConfirmKlarnaPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmKlarnaPayment(clientSecret, data, options))),
      first()
    );
  }

  confirmKonbiniPayment(
    clientSecret: string,
    data?: ConfirmKonbiniPaymentData,
    options?: ConfirmKonbiniPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmKonbiniPayment(clientSecret, data, options))),
      first()
    );
  }

  confirmOxxoPayment(
    clientSecret: string,
    data?: ConfirmOxxoPaymentData,
    options?: ConfirmOxxoPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmOxxoPayment(clientSecret, data, options))),
      first()
    );
  }

  confirmP24Payment(
    clientSecret: string,
    data?: ConfirmP24PaymentData,
    options?: ConfirmP24PaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmP24Payment(clientSecret, data, options))),
      first()
    );
  }

  confirmPayNowPayment(
    clientSecret: string,
    data?: ConfirmPayNowPaymentData,
    options?: ConfirmPayNowPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmPayNowPayment(clientSecret, data, options))),
      first()
    );
  }

  confirmPayPalPayment(clientSecret: string, data?: ConfirmPayPalPaymentData): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmPayPalPayment(clientSecret, data))),
      first()
    );
  }

  confirmPixPayment(
    clientSecret: string,
    data?: ConfirmPixPaymentData,
    options?: ConfirmPixPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmPixPayment(clientSecret, data, options))),
      first()
    );
  }

  confirmPromptPayPayment(
    clientSecret: string,
    data?: ConfirmPromptPayPaymentData,
    options?: ConfirmPromptPayPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmPromptPayPayment(clientSecret, data, options))),
      first()
    );
  }

  confirmSepaDebitPayment(clientSecret: string, data?: ConfirmSepaDebitPaymentData): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmSepaDebitPayment(clientSecret, data))),
      first()
    );
  }

  confirmSofortPayment(
    clientSecret: string,
    data?: ConfirmSofortPaymentData,
    options?: ConfirmSofortPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmSofortPayment(clientSecret, data, options))),
      first()
    );
  }

  confirmWechatPayPayment(
    clientSecret: string,
    data?: ConfirmWechatPayPaymentData,
    options?: ConfirmWechatPayPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmWechatPayPayment(clientSecret, data, options))),
      first()
    );
  }

  handleCardAction(clientSecret: string): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.handleCardAction(clientSecret))),
      first()
    );
  }

  verifyMicrodepositsForPayment(
    clientSecret: string,
    data?: VerifyMicrodepositsForPaymentData
  ): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.verifyMicrodepositsForPayment(clientSecret, data))),
      first()
    );
  }

  createRadarSession(): Observable<RadarSessionPayload> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.createRadarSession())),
      first()
    );
  }

  collectBankAccountForPayment(options: CollectBankAccountForPaymentOptions): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.collectBankAccountForPayment(options))),
      first()
    );
  }

  createPaymentMethod(paymentMethodData: CreatePaymentMethodData): Observable<PaymentMethodResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.createPaymentMethod(paymentMethodData))),
      first()
    );
  }

  retrievePaymentIntent(clientSecret: string): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.retrievePaymentIntent(clientSecret))),
      first()
    );
  }

  confirmSetup(options: {
    elements: StripeElements;
    confirmParams?: Partial<ConfirmPaymentData>;
    redirect: 'if_required';
  }): Observable<SetupIntentResult>;
  confirmSetup(options: {
    elements: StripeElements;
    confirmParams: ConfirmPaymentData;
    redirect?: 'always';
  }): Observable<never | { error: StripeError }>;
  confirmSetup(options) {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmSetup(options))),
      first()
    );
  }

  confirmAcssDebitSetup(
    clientSecret: string,
    data?: ConfirmAcssDebitSetupData,
    options?: ConfirmAcssDebitSetupOptions
  ): Observable<SetupIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmAcssDebitSetup(clientSecret, data, options))),
      first()
    );
  }

  confirmUsBankAccountSetup(clientSecret: string, data?: ConfirmUsBankAccountSetupData): Observable<SetupIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmUsBankAccountSetup(clientSecret, data))),
      first()
    );
  }

  confirmAuBecsDebitSetup(clientSecret: string, data?: ConfirmAuBecsDebitSetupData): Observable<SetupIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmAuBecsDebitSetup(clientSecret, data))),
      first()
    );
  }

  confirmBacsDebitSetup(clientSecret: string, data?: ConfirmBacsDebitSetupData): Observable<SetupIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmBacsDebitSetup(clientSecret, data))),
      first()
    );
  }

  confirmBancontactSetup(clientSecret: string, data?: ConfirmBancontactSetupData): Observable<SetupIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmBancontactSetup(clientSecret, data))),
      first()
    );
  }

  confirmCardSetup(
    clientSecret: string,
    data?: ConfirmCardSetupData,
    options?: ConfirmCardSetupOptions
  ): Observable<SetupIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmCardSetup(clientSecret, data, options))),
      first()
    );
  }

  confirmIdealSetup(clientSecret: string, data?: ConfirmIdealSetupData): Observable<SetupIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmIdealSetup(clientSecret, data))),
      first()
    );
  }

  confirmPayPalSetup(clientSecret: string, data?: ConfirmPayPalSetupData): Observable<SetupIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmPayPalSetup(clientSecret, data))),
      first()
    );
  }

  confirmSepaDebitSetup(clientSecret: string, data?: ConfirmSepaDebitSetupData): Observable<SetupIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmSepaDebitSetup(clientSecret, data))),
      first()
    );
  }

  confirmSofortSetup(
    clientSecret: string,
    data?: ConfirmSofortSetupData,
    options?: ConfirmSofortSetupOptions
  ): Observable<SetupIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmSofortSetup(clientSecret, data, options))),
      first()
    );
  }

  confirmAffirmPayment(
    clientSecret: string,
    data?: ConfirmAffirmPaymentData,
    options?: ConfirmAffirmPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmAffirmPayment(clientSecret, data, options))),
      first()
    );
  }

  confirmAfterpayClearpayPayment(
    clientSecret: string,
    data?: ConfirmAfterpayClearpayPaymentData,
    options?: ConfirmAfterpayClearpayPaymentOptions
  ): Observable<PaymentIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.confirmAfterpayClearpayPayment(clientSecret, data, options))),
      first()
    );
  }

  verifyMicrodepositsForSetup(
    clientSecret: string,
    data?: VerifyMicrodepositsForSetupData
  ): Observable<SetupIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.verifyMicrodepositsForSetup(clientSecret, data))),
      first()
    );
  }

  collectBankAccountForSetup(options: CollectBankAccountForSetupOptions): Observable<SetupIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.collectBankAccountForSetup(options))),
      first()
    );
  }

  retrieveSetupIntent(clientSecret: string): Observable<SetupIntentResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.retrieveSetupIntent(clientSecret))),
      first()
    );
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
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.processOrder(options))),
      first()
    );
  }

  retrieveOrder(clientSecret: string): Observable<RetrieveOrderResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.retrieveOrder(clientSecret))),
      first()
    );
  }

  paymentRequest(options: PaymentRequestOptions): PaymentRequest {
    const stripe = this.getInstance();
    return stripe.paymentRequest(options);
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
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.createToken(tokenType, data))),
      first()
    );
  }

  createSource(element: StripeElement, sourceData: CreateSourceData): Observable<SourceResult>;
  createSource(sourceData: CreateSourceData): Observable<SourceResult>;
  createSource(a, b?): Observable<SourceResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.createSource(a, b))),
      first()
    );
  }

  retrieveSource(source: RetrieveSourceParam): Observable<SourceResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.retrieveSource(source))),
      first()
    );
  }

  verifyIdentity(clientSecret: string): Observable<VerificationSessionResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.verifyIdentity(clientSecret))),
      first()
    );
  }

  collectFinancialConnectionsAccounts(
    options: CollectFinancialConnectionsAccountsOptions
  ): Observable<FinancialConnectionsSessionResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.collectFinancialConnectionsAccounts(options))),
      first()
    );
  }

  collectBankAccountToken(options: CollectBankAccountTokenOptions): Observable<CollectBankAccountTokenResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.collectBankAccountToken(options))),
      first()
    );
  }

  createEphemeralKeyNonce(options: EphemeralKeyNonceOptions): Observable<EphemeralKeyNonceResult> {
    return this.stripe.pipe(
      switchMap((stripe) => from(stripe.createEphemeralKeyNonce(options))),
      first()
    );
  }

  /**
   * @deprecated
   */
  handleCardPayment(clientSecret: string, element?, data?) {
    return this.stripe.pipe(
      switchMap((stripe) => from((stripe as any).handleCardPayment(clientSecret, element, data))),
      first()
    ) as Observable<PaymentIntentResult>;
  }

  /**
   * @deprecated
   */
  confirmPaymentIntent(clientSecret: string, element?, data?) {
    return this.stripe.pipe(
      switchMap((stripe) => from((stripe as any).confirmPaymentIntent(clientSecret, element, data))),
      first()
    ) as Observable<PaymentIntentResult>;
  }

  /**
   * @deprecated
   */
  handleCardSetup(clientSecret: string, element?, data?) {
    return this.stripe.pipe(
      switchMap((stripe) => from((stripe as any).handleCardSetup(clientSecret, element, data))),
      first()
    ) as Observable<SetupIntentResult>;
  }

  /**
   * @deprecated
   */
  confirmSetupIntent(clientSecret: string, element?, data?) {
    return this.stripe.pipe(
      switchMap((stripe) => from((stripe as any).confirmSetupIntent(clientSecret, element, data))),
      first()
    ) as Observable<SetupIntentResult>;
  }

  /**
   * @deprecated
   */
  handleFpxPayment(clientSecret: string, element?, data?) {
    return this.stripe.pipe(
      switchMap((stripe) => from((stripe as any).handleFpxPayment(clientSecret, element, data))),
      first()
    ) as Observable<SetupIntentResult>;
  }

  private getNgxStripeAppInfo(version: string): WrapperLibrary {
    return {
      name: 'ngx-stripe',
      url: 'https://ngx-stripe.dev',
      partner_id: 'pp_partner_JR4l1rmvUoPP4V',
      version
    };
  }
}
