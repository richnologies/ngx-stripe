# Security Policy

## Supported versions

Security fixes are applied to **active** lanes first (see [`lanes.json`](./lanes.json) and [docs: Pick your lane](https://ngx-stripe.dev/docs/versioning)). Maintenance and LTS lines get fixes as practical.

ngx-stripe does **not** process card data itself — Elements and Stripe.js run in Stripe-controlled iframes. Most PCI concerns are covered by Stripe’s security model; keep Stripe.js loaded from the official CDN for your named train.

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security reports.

Email **me@ricardosanchez.dev** with:

- Affected ngx-stripe version(s) and Angular / `@stripe/stripe-js` majors
- Description and impact
- Reproduction steps or PoC if available

You should receive an acknowledgement within a few business days. Coordinated disclosure is appreciated.

For Stripe.js / Elements platform issues, report through [Stripe Support](https://support.stripe.com/) as well — we can help triage ownership.
