Collect Payments with Stripe: The Angular Way

<a href="https://stripe.com/partners/ngx-stripe" target="_blank"><img src="./docs/logos/stripe_partner_badge_verified_blurple.png" alt="Stripe Verified Partner" width="98"/></a>
[![version](https://img.shields.io/npm/v/ngx-stripe.svg)](https://www.npmjs.com/package/ngx-stripe)
[![license](https://img.shields.io/npm/l/ngx-stripe.svg)](https://www.npmjs.com/package/ngx-stripe)

<h1 align="center">
  <img width="160" valign="bottom" src="./docs/logos/ngx-stripe-logo.png" alt="ngx-stripe">
</h1>

Angular components and services for [Stripe Elements](https://stripe.com/docs/stripe-js) — a thin, typed wrapper around [Stripe.js](https://stripe.com/docs/js).

**Docs:** [ngx-stripe.dev](https://ngx-stripe.dev/docs) · **Stripe.js versioning:** [Stripe policy](https://docs.stripe.com/sdks/stripejs-versioning)

## Install

```bash
npm install ngx-stripe @stripe/stripe-js
```

`ngx-stripe` version = `{angularMajor}.{stripeJsMajor}.{patch}` (e.g. `22.9.x` = Angular 22 + Stripe.js dahlia / `@stripe/stripe-js` v9).

Older Angular majors / Stripe trains: use an npm dist-tag or pin a version from the table below. Full setup, **pick your lane**, CSP, and Elements guides: [ngx-stripe.dev/docs](https://ngx-stripe.dev/docs). Minimal Payment Element playground (StackBlitz via GitHub): [`playground/lanes`](./playground/lanes).

```bash
npm install ngx-stripe@v21-dahlia @stripe/stripe-js@^9
```

<!-- lanes:table:start -->
| Angular | v9 dahlia | v8 clover | v7 basil | v6 acacia | v5 |
| --- | --- | --- | --- | --- | --- |
| 22 | 22.9.x+ | 22.8.x+ | 22.7.x+ | 22.6.x+ | 22.5.x+ |
| 21 | 21.9.x+ | 21.8.x+ | 21.7.x+ | 21.6.x+ | 21.5.x+ |
| 20 | 20.9.x+ | 20.8.x+ | 20.7.x+ | 20.6.x+ | 20.5.x+ |
| 19 | 19.9.x+ | 19.8.x+ | 19.7.x+ | 19.6.x+ | 19.5.x+ |
| 18 | 18.x+ | — | — | — | — |
| 17 | 17.x+ | — | — | — | — |
| 16 | 16.x+ | — | — | — | — |
| 15 | 15.x+ | — | — | — | — |
| 14 | 14.x+ | — | — | — | — |
| 13 | 13.x+ | — | — | — | — |
| 12 | 12.x+ | — | — | — | — |
| 11 | 11.x+ | — | — | — | — |
| 10 | 10.x+ | — | — | — | — |
| 9 | v9-lts / 9.4.0 | — | — | — | — |
| 8 | v8-lts / 8.2.0 | — | — | — | — |
<!-- lanes:table:end -->

## Quick start

```ts
import { provideNgxStripe } from 'ngx-stripe';

bootstrapApplication(AppComponent, {
  providers: [
    provideNgxStripe('pk_test_...'),
  ],
});
```

Payment Element and the full API: [docs](https://ngx-stripe.dev/docs).

## Support

MIT-licensed. Sponsors keep the project aligned with Angular and Stripe.js majors: [GitHub Sponsors](https://github.com/sponsors/richnologies).

See [CONTRIBUTING.md](./CONTRIBUTING.md), [SECURITY.md](./SECURITY.md), and the [support policy](https://ngx-stripe.dev/docs/support) on the docs site.

### Principal Sponsors

<p float="left">
  <a href="https://stripe.com" rel="nofollow noopener noreferrer" target="_blank">
    <img src="./docs/logos/stripe_blurple.png" width="210" alt="Stripe" />
  </a>
  <a href="https://www.psi-mobile.com" rel="nofollow noopener noreferrer" target="_blank">
    <img src="./docs/logos/psi-logo.png" width="170" alt="PSI" />
  </a>
</p>

## License

MIT © [Ricardo Sánchez Gregorio](mailto:me@ricardosanchez.dev)
