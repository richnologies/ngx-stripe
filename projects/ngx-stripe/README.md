Collect Payments with Stripe: The Angular Way

<a href="https://stripe.com/partners/ngx-stripe" target="_blank"><img src="https://raw.githubusercontent.com/richnologies/ngx-stripe/main/docs/logos/stripe_partner_badge_verified_blurple.png" alt="Stripe Verified Partner" width="98"/></a>
[![version](https://img.shields.io/npm/v/ngx-stripe.svg)](https://www.npmjs.com/package/ngx-stripe)
[![license](https://img.shields.io/npm/l/ngx-stripe.svg)](https://www.npmjs.com/package/ngx-stripe)

<h1 align="center">
  <img width="160" valign="bottom" src="https://raw.githubusercontent.com/richnologies/ngx-stripe/main/docs/logos/ngx-stripe-logo.png" alt="ngx-stripe">
</h1>

Angular components and services for [Stripe Elements](https://stripe.com/docs/stripe-js) — a thin, typed wrapper around [Stripe.js](https://stripe.com/docs/js).

**Docs:** [ngx-stripe.dev](https://ngx-stripe.dev/docs) · **First payment:** [guided tour](https://ngx-stripe.dev/docs/first-payment) · **Stripe.js versioning:** [Stripe policy](https://docs.stripe.com/sdks/stripejs-versioning)

## Install

```bash
npm install ngx-stripe @stripe/stripe-js
```

`ngx-stripe` version = `{angularMajor}.{stripeJsMajor}.{patch}` (e.g. `22.10.x` = Angular 22 + Stripe.js endive / `@stripe/stripe-js` v10).

Older Angular majors / Stripe trains: use an npm dist-tag or pin a version from the table below. Full setup, **pick your lane**, CSP, and Elements guides: [ngx-stripe.dev/docs](https://ngx-stripe.dev/docs). Minimal Payment Element playground: [playground/lanes](https://github.com/richnologies/ngx-stripe/tree/main/playground/lanes).

```bash
npm install ngx-stripe@v22-dahlia @stripe/stripe-js@^9
```

<!-- lanes:table:start -->
| Angular | v10 endive | v9 dahlia | v8 clover | v7 basil | v6 acacia | v5 |
| --- | --- | --- | --- | --- | --- | --- |
| 22 | 22.10.x+ | 22.9.x+ | 22.8.x+ | 22.7.x+ | 22.6.x+ | 22.5.x+ |
| 21 | 21.10.x+ | 21.9.x+ | 21.8.x+ | 21.7.x+ | 21.6.x+ | 21.5.x+ |
| 20 | 20.10.x+ | 20.9.x+ | 20.8.x+ | 20.7.x+ | 20.6.x+ | 20.5.x+ |
| 19 | 19.10.x+ | 19.9.x+ | 19.8.x+ | 19.7.x+ | 19.6.x+ | 19.5.x+ |
| 18 | 18.10.x+ | 18.9.x+ | — | — | — | — |
| 17 | 17.10.x+ | 17.9.x+ | — | — | — | — |
| 16 | 16.x+ | — | — | — | — | — |
| 15 | 15.x+ | — | — | — | — | — |
| 14 | 14.x+ | — | — | — | — | — |
| 13 | 13.x+ | — | — | — | — | — |
| 12 | 12.x+ | — | — | — | — | — |
| 11 | 11.x+ | — | — | — | — | — |
| 10 | 10.x+ | — | — | — | — | — |
| 9 | v9-lts / 9.4.0 | — | — | — | — | — |
| 8 | v8-lts / 8.2.0 | — | — | — | — | — |
<!-- lanes:table:end -->

## Collect your first payment

Four steps from providers to a confirmed PaymentIntent. This matches the [docs guided tour](https://ngx-stripe.dev/docs/first-payment) — Payment Element is the recommended path (cards, wallets, and local methods in one UI). Card Element is still fully supported; the tour covers both.

### 1. Provide ngx-stripe

Register Stripe in your app config. Only publishable keys (`pk_test_` / `pk_live_`) belong in the browser.

```ts
import { ApplicationConfig } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideNgxStripe } from 'ngx-stripe';

import { AppComponent } from './app/app.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNgxStripe('pk_test_…'),
  ]
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

### 2. Create the Elements container

`ngx-stripe-elements` is the shared Stripe Elements context. For Payment Element flows, set `clientSecret` from a PaymentIntent (or SetupIntent) created on your server.

```ts
import { Component } from '@angular/core';
import { StripeElementsOptions } from '@stripe/stripe-js';
import {
  injectStripe,
  StripeElementsDirective,
  StripePaymentElementComponent
} from 'ngx-stripe';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [StripeElementsDirective, StripePaymentElementComponent],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent {
  stripe = injectStripe();

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
    // clientSecret from your server (PaymentIntent / SetupIntent)
    clientSecret: '{{CLIENT_SECRET}}',
    appearance: { theme: 'stripe' }
  };
}
```

```html
<ngx-stripe-elements
  [stripe]="stripe"
  [elementsOptions]="elementsOptions"
>
  <!-- Payment Element or Card Element goes here -->
</ngx-stripe-elements>
```

### 3. Drop in Payment Element

Mount `ngx-stripe-payment` inside the Elements container once you have a `clientSecret`.

```html
<form [formGroup]="checkoutForm" (ngSubmit)="pay()">
  <input formControlName="name" placeholder="Name" />
  <input formControlName="email" type="email" placeholder="Email" />

  @if (elementsOptions.clientSecret) {
    <ngx-stripe-elements
      [stripe]="stripe"
      [elementsOptions]="elementsOptions"
    >
      <ngx-stripe-payment />
    </ngx-stripe-elements>
  }

  <button type="submit" [disabled]="paying">Pay</button>
</form>
```

Prefer Card Element instead? Swap in `ngx-stripe-card` and confirm with `confirmCardPayment` — same provide + Elements steps. Details in the [tour](https://ngx-stripe.dev/docs/first-payment) and [Card Elements docs](https://ngx-stripe.dev/docs/card-elements).

### 4. Confirm the payment

Your server creates the PaymentIntent; the browser confirms it through ngx-stripe. Hold a `ViewChild` of the Payment Element so you can pass `elements` into `confirmPayment`.

```ts
@ViewChild(StripePaymentElementComponent)
paymentElement!: StripePaymentElementComponent;

pay() {
  this.paying = true;

  this.stripe
    .confirmPayment({
      elements: this.paymentElement.elements,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name: this.checkoutForm.value.name!,
            email: this.checkoutForm.value.email!
          }
        }
      },
      redirect: 'if_required'
    })
    .subscribe((result) => {
      this.paying = false;
      if (result.error) {
        // Show error to your customer
        return;
      }
      if (result.paymentIntent?.status === 'succeeded') {
        // Payment succeeded
      }
    });
}
```

That’s the whole client path. Wire `clientSecret` to your backend, then [try a live test checkout](https://ngx-stripe.dev/docs/first-payment) with card `4242 4242 4242 4242` (any future expiry, any CVC).

Element reference, service API, and more examples: [ngx-stripe.dev/docs](https://ngx-stripe.dev/docs).

## Support

MIT-licensed. Sponsors keep the project aligned with Angular and Stripe.js majors: [GitHub Sponsors](https://github.com/sponsors/richnologies).

See [CONTRIBUTING.md](https://github.com/richnologies/ngx-stripe/blob/main/CONTRIBUTING.md), [SECURITY.md](https://github.com/richnologies/ngx-stripe/blob/main/SECURITY.md), and the [support policy](https://ngx-stripe.dev/docs/support) on the docs site.

### Principal Sponsors

<p float="left">
  <a href="https://stripe.com" rel="nofollow noopener noreferrer" target="_blank">
    <img src="https://raw.githubusercontent.com/richnologies/ngx-stripe/main/docs/logos/stripe_blurple.png" width="210" alt="Stripe" />
  </a>
  <a href="https://www.psi-mobile.com" rel="nofollow noopener noreferrer" target="_blank">
    <img src="https://raw.githubusercontent.com/richnologies/ngx-stripe/main/docs/logos/psi-logo.png" width="170" alt="PSI" />
  </a>
</p>

## License

MIT © [Ricardo Sánchez Gregorio](mailto:me@ricardosanchez.dev)
