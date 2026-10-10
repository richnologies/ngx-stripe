---
name: ngx-stripe
description: >-
  Integrate ngx-stripe in an Angular application: provideNgxStripe,
  injectStripe, StripeService Observables, and ngx-stripe-* Elements.
  Use when adding payments to an app, installing ngx-stripe, wrapping Stripe
  Elements, Payment Element, Express Checkout, or picking an ngx-stripe version
  lane. Do not use when maintaining the ngx-stripe library itself.
---

# ngx-stripe (consumer)

ngx-stripe wraps Stripe.js for Angular. It does **not** own types, Element UI, payment methods, or PCI.

This is an [Agent Skill](https://agentskills.io) (`SKILL.md`). Install from GitHub into any editor that supports the format:

```bash
npx skills add richnologies/ngx-stripe
```

- Types: `@stripe/stripe-js` only. Do not invent parallel interfaces.
- Install: `npm install ngx-stripe @stripe/stripe-js`
- Version: `{angularMajor}.{stripeJsMajor}.{patch}` — e.g. `22.10.x` is Angular 22 + Stripe.js v10 (endive CDN).
- Setup: `provideNgxStripe('pk_…')` in `appConfig.providers`, then `injectStripe()`. Keep `NgxStripeModule.forRoot()` only for existing NgModule apps.
- Service methods return **Observables** (`from(stripe.method()).pipe(first())`). Subscribe or convert; do not treat them as Promises.
- Elements: put hosts inside `<ngx-stripe-elements [stripe]="stripe" [elementsOptions]="elementsOptions">`. Implicit `[stripe]` on the child is deprecated.
- Split Card (`ngx-stripe-card-number` / `expiry` / `cvc`) must be wrapped in `ngx-stripe-card-group`.

## clientSecret

If the Element needs an Intent, set `elementsOptions.clientSecret` **before** the parent Elements instance is created. Nested Elements cannot update `clientSecret` later.

```html
@if (elementsOptions.clientSecret) {
  <ngx-stripe-elements [stripe]="stripe" [elementsOptions]="elementsOptions">
    <ngx-stripe-payment />
  </ngx-stripe-elements>
}
```

Payment Element also has `doNotCreateUntilClientSecretIsSet` for the implicit (no parent) path.

## Ownership

| ngx-stripe | Stripe.js |
| --- | --- |
| DI, CDN loader, Observables, host components | Appearance, options, validation copy, payment methods |

Link Stripe docs for styling/options. Link ngx-stripe docs for selectors and Angular lifecycle.

## Do not

- Use `ngx-stripe-payment-request-button` on Stripe.js v10 / ngx-stripe `*.10` (removed; use Express Checkout or Payment Element, or stay on a dahlia lane). Old URLs: https://ngx-stripe.dev/docs/payment-request-button
- Duplicate Stripe types inside the app.
- Call `elements.update({ clientSecret })` on an already-created nested Elements group.

## Resources

- Docs: https://ngx-stripe.dev
- Machine index: https://ngx-stripe.dev/llms.txt
- Full element map: [elements.md](elements.md)
