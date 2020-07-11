# Migration Guides | Ngx Stripe

Below are the major changes for update from legacy to active `ngx-stripe`

## Interfaces

Most of the changes in the library are because ngx-stripe will no longer maintain its own types. Instead, it will make use of the official Stripe types.

Changes in the interfaces should always be for the best, no mistach between Stripe and ngx-stripe. Always up to the date the last changes.

The main change will be in terms of naming. The following table aim to be
a guide reference:

| Legacy                | Active                                                  |
| --------------------- | ------------------------------------------------------- |
| Options               | StripeConstructorOptions                                |
| StripeJS              | Stripe                                                  |
| ElementsOptions       | StripeElementsOptions                                   |
| Element               | StripeElement                                           |
| Elements              | StripeElements                                          |
| PaymentRequestOptions | PaymentRequestOptions                                   |
| PaymentIntentResult   | { paymentIntent?: PaymentIntent; error?: StripeError; } |
| CardSetupResult       | { setupIntent?: SetupIntent; error?: StripeError; }     |
| SourceData            | CreateSourceData                                        |
| SourceParams          | RetrieveSourceParam                                     |
| SourceResult          | { source?: Source; error?: StripeError }                |
| TokenResult           | { token?: Token; error?: StripeError }                  |
| PiiData               | CreateTokenPiiData                                      |
| BankAccountData       | CreateTokenBankAccountData                              |
| CardDataOptions       | CreateTokenCardData                                     |
| Account               | TokenCreateParams.Account                               |

**NOTE: In `legacy` types were imported from `ngx-stripe`, while in `active` they are imported from `@stripe/stripe-js`**

**NOTE 2: Please if you notices any missing type, open an issue or a PR and we will try to address it as soon as possible**

## Stripe Service

Now the good news. The Stripe Service has been updated to include all the new APIs from StripeJS. No problems shoudl arise here, since basically what we have done is add missing methods. Nothing has been removed. Issue will be likely type related.

For more information about the API please check the [docs](https://richnologies.gitbook.io/ngx-stripe/)

This is a list comparing the available methods in both `legacy` and `active`:

| Legacy               | Active                    | Notes                 |
| -------------------- | ------------------------- | --------------------- |
| getStripeReference   | getStripeReference        | No Changes            |
| getInstance          | getInstance               | Type changes only     |
| setKey               | setKey                    | Types changes only    |
| changeKey            | changeKey                 | Types changes only    |
| elements             | elements                  | Types changes only    |
| Not Supported        | redirectToCheckout        | New                   |
| Not Supported        | confirmAuBecsDebitPayment | New                   |
| Not Supported        | confirmBancontactPayment  | New                   |
| Not Supported        | confirmCardPayment        | New                   |
| Not Supported        | confirmEpsPayment         | New                   |
| Not Supported        | confirmFpxPayment         | New                   |
| Not Supported        | confirmGiropayPayment     | New                   |
| Not Supported        | confirmIdealPayment       | New                   |
| Not Supported        | confirmP24Payment         | New                   |
| Not Supported        | confirmSepaDebitPayment   | New                   |
| handleCardAction     | handleCardAction          | Types changes only    |
| createPaymentMethod  | createPaymentMethod       | Types changes only    |
| Not Supported        | retrievePaymentIntent     | New                   |
| Not Supported        | confirmAuBecsDebitSetup   | New                   |
| Not Supported        | confirmCardSetup          | New                   |
| Not Supported        | confirmSepaDebitSetup     | New                   |
| Not Supported        | retrieveSetupIntent       | New                   |
| paymentRequest       | paymentRequest            | Types changes only    |
| createToken          | createToken               | Better type inferance |
| createSource         | createSource              | Better type inferance |
| retrieveSource       | retrieveSource            | Types changes only    |
| handleCardPayment    | handleCardPayment         | **deprecated**        |
| confirmPaymentIntent | confirmPaymentIntent      | **deprecated**        |
| handleCardSetup      | handleCardSetup           | **deprecated**        |
| Not Supported        | confirmSetupIntent        | **deprecated**        |
| Not Supported        | handleFpxPayment          | **deprecated**        |

**NOTE: Deprecated functions will be part of the Service of the service as long as they remain part of stripe. No plans to remove them by our own choice.**

## Stripe Element Components

Until this version we only have support for `CardElement`. Now we are adding all the missing element avaiable. For more information about the API please check the [docs](https://richnologies.gitbook.io/ngx-stripe/)

| Element                     | Selector                  | Notes                                                                                                                                                    |
| --------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CardElement                 | getStripeReference        | A flexible single-line input that collects all necessary card details.                                                                                   |
| CardNumberElement           | getInstance               | Collects the card number.only                                                                                                                            |
| CardExpiryElement           | setKey                    | Collects the card‘s expiration date. only                                                                                                                |
| CardCvcElement              | changeKey                 | Collects the card‘s CVC number.only                                                                                                                      |
| PaymentRequestButtonElement | elements                  | An all-in-one checkout button backed by either Apple Pay or the Payment Request API. Refer to the Payment Request Button docs for more information. only |
| AuBankAccountElement        | redirectToCheckout        | Collects Australian bank account information (BSB and account number) for use with BECS Direct Debit payments.                                           |
| IbanElement                 | confirmAuBecsDebitPayment | The International Bank Account Number (IBAN). Available for SEPA countries.                                                                              |
| IdealBankElement            | confirmBancontactPayment  | The customer's bank, for use with iDEAL payments.                                                                                                        |
| FpxBankElement              | confirmCardPayment        | The customer's bank, for use with FPX payments.                                                                                                          |
