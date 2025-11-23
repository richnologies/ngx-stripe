# Changelog

## 21.8.0 - 2025-11-23

- Add support for Angular v21

## 20.8.0 - 2025-11-23

- Add support for StripeJS V8 - clover
- Remove Affirm Message Component
- Remove Afterpay Clearpay Message Component
- Remove EPS Bank Component
- Remove FPX Bank Component
- Remove Ideal Bank Component
- Remove P24 Bank Component

## 20.7.0 - 2025-05-28

- Add support for StripeJS V7 - basil

## 20.6.1 - 2025-05-28

- Fix importing StripeJS

## 20.6.0 - 2025-05-28

- Add support for StripeJS V6 - acacia

## 20.5.0 - 2025-05-28

- Add support for Angular v20

## 19.7.0 - 2025-05-28

- Add support for StripeJS V7 - basil

## 19.6.0 - 2025-05-28

- Add support for StripeJS V6 - acacia

## 19.5.0 - 2025-05-28

- [#231](https://github.com/richnologies/ngx-stripe/issues/231) Fix an error with `Hydration warnings with SSR`
- Add support for MultibancoPayment
- Add support for TwintPayment

## 19.0.0 - 2024-11-27

- Add support for Angular v19
- Add support for StripeJS v5

## 18.1.0 - 2024-06-18

- Add support for StripeJS v4
- Add support for MobilePay
- Add support for ConfirmationTokens
- Update ConfirmSetup params type

## 18.0.0 - 2024-05-24

- Add support for Angular v18

## 17.2.0 - 2024-04-10

- Remove Card Element Types

## 17.1.1 - 2024-02-18

- Fix NPM dependencies

## 17.1.0 - 2024-02-13

- Add support for StripeJS v3

## 17.0.1 - 2023-11-18

- Multiple updates to the docs site
- Update the README file
- to boldly go with your payments where no one has gone before

## 17.0.0 - 2023-11-08

- Add support for Angular v17

## 16.3.1 - 2023-11-08

- [#231](https://github.com/richnologies/ngx-stripe/issues/231) Fix an error with `Payment Request Button Element`

## 16.3.0 - 2023-11-07

- Update stripe peer dependency to `2.1.11`. This is a major change, but the breaking change is minimum so we believe is better to stay aligned with Angular instead of bump a new major.
- Add support for `Express Checkout Element`

## 16.2.0 - 2023-07-17

- Adding `provideNgxStripe` method for Standalone Applications

## 16.1.2 - 2023-06-30

- Update stripe peer dependency to `1.54.1`

## 16.1.1 - 2023-06-02

- Update stripe peer dependency to `1.54.0`

## 16.1.0 - 2023-05-27

- Payment Method Messaging Element support
- Add support for Blik Payemnts
- Add support for Cashapp Payments
- Add new types for `ConfirmPaymet`
- Add new types for `createPaymentMethod`
- Add new types for `confirmSetup`
- Add support for `handleNextAction`

## 16.0.0 - 2023-05-04

- Add support for Angular v16

## 15.6.0 - 2023-03-31

- Improve typing with the new `StripeElementsOptions`
- Add support for `StripeCardElementUpdateOptions` new typing
- Fix small issue with one docs example
- Update peer dependencies on `@stripe/stripe-js`

## 15.5.1 - 2023-03-14

- Removing use of Observable `lastValueFrom` to bring back support for RxJS@6

## 15.4.1 - 2023-02-05

- Cleaner implementation for events in `NgxStripeCardGroup`

## 15.4.0 - 2023-02-05

- Add events to `NgxStripeCardGroup` directive

## 15.3.0 - 2023-02-04

- Add support for `Issuing Elements`

## 15.2.0 - 2023-01-18

- Add support for Standalone Components

## 15.1.1 - 2023-01-17

- Fix type error for `paymentRequest` method

## 15.1.0 - 2023-01-17

- Add `injectStripe` build on the new Angular `inject` function

## 15.0.0 - 2023-01-16

- Add support for Angular v15

## 14.3.0 - 2023-01-16

- Add Elements Directive to share elements group between components
- Address Element support
- Affirm Message Element support
- Afterpay Clearpay Message Element support
- Eps Bank Element support
- Link Authentication Element support
- P24 Bank Element support
- Better typings for Intents results
- Pix Payments support
- Radar session
- Orders support
- Boleto Payments support
- Financial Connections support
- Ephemeral Key Nonce support

## 14.2.0 - 2022-09-28
- Fix peer dependencies

## 14.1.0 - 2022-06-24

- Add support for `fetchUpdates` for Payment Element
- Add support for `loaderror` for Payment Element
- Add `abort` and `isShowing` for Payment Request Button

## 14.0.0 - 2022-06-24

- Support for Angular 14

## 13.2.1 - 2022-05-17

- Fixing mess with versions :(

## 13.2.0 - 2022-05-17

- [#103](https://github.com/richnologies/ngx-stripe/issues/169) Fix a little bug related to Payment Request Button

## 13.1.0 - 2022-04-27

- Update whole project to use Angular v13
- Add support for confirmSofort* options
- Add support for confirmKonbiniPayments
- Add support for US Bank Accounts

## 13.0.0 - 2021-11-11

- Update peer dependencies for Angular v13

## 12.7.2 - 2021-11-05

- Undo peer dependencies workaround

## 12.7.1 - 2021-11-03

- Fix peer dependencies

## 12.7.0 - 2021-10-22

- Add support for Payment Element
- Add support for Affirm Payment
- Add support for Prompt Pay Payment
- Add support for Pay Now Payment

## 12.6.0 - 2021-10-10

- Add support for Loading Template

## 12.5.0 - 2021-09-24

- Add support for Boleto Payments

## 12.4.0 - 2021-08-09

- Remove temporary workaround for Stripe Identity
- Update types for Payment Request Button
- Add support for PayPal Payments (requires beta access)

## 12.3.1 - 2021-06-30

- Add Stripe Verified Partner badge

## 12.3.0 - 2021-06-30

- Add support for Stripe Identity

## 12.2.1 - 2021-06-25

- Update README.md with new Logo

## 12.2.0 - 2021-06-19

- Add support for Acss Debit Payments
- Add support for Afterpay Clearpay Payments
- Add support for Alipay Payments
- Add support for GrabPay Payments
- Add support for Klarna Payments (requires beta access)
- Add support for Sofort Payments
- Add support for WeChat Pay Payments (requires beta access)
- Add support for Verify Microdeposits Payments
- Add support for Bacs Debit Setup
- Add support for Bancontact Setup
- Add support for Ideal Bank Setup
- Add support for Sofort Setup
- Add support for Verify Microdeposits Setup

## 12.1.1 - 2021-06-19

- Add support for OXXO Payments

## 12.0.0 - 2021-05-15

- Add support for Angular v12

## 10.1.2 - 2020-08-06

- [#103](https://github.com/richnologies/ngx-stripe/issues/103) Fix a little bug related to Payment Request Button
- Adds a new Output `notavailable` to Payment Request Button

## 10.1.1 - 2020-07-17

- [#101](https://github.com/richnologies/ngx-stripe/issues/101) Fix ngx-stripe-card now requires elementsOptions and options to render?

## 10.1.0 - 2020-07-16

- [#100](https://github.com/richnologies/ngx-stripe/issues/100) Fix confirmCardSetup returns 400 error, if separated elements are used

## 10.0.4 - 2020-07-14

- [#99](https://github.com/richnologies/ngx-stripe/issues/99) Fix No provider for StripeElementsService

## 10.0.0 - 2020-07-11

- Release new major version of the library. More info about migration [here](https://github.com/richnologies/ngx-stripe/blob/main/MIGRATION.md)

## 9.0.3 - 2020-06-28

- [#89](https://github.com/richnologies/ngx-stripe/issues/89) Fix ModuleWithProviders generics issue

## 7.4.3 - 2019-06-15

- [#73](https://github.com/richnologies/ngx-stripe/pull/73) Fixed incorrect argument types on `handleCardPayment()`.

## 7.4.0 - 2019-05-27

- [#66](https://github.com/richnologies/ngx-stripe/pull/66) Fixed missing methods and interface declarations for PaymentIntents and PaymentMethods
