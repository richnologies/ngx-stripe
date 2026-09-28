# Contributing to ngx-stripe

Thanks for helping. This library is a thin Angular wrapper around Stripe.js — prefer small, complete changes over drive-by refactors.

## Setup

```bash
npm ci
npm start          # docs at http://localhost:4242
npm test           # contract unit tests (ChromeHeadless)
npm run build:lib
npm run pack:smoke
npm run smoke:docs # Playwright against the docs app
```

## Version lanes

- Source of truth: [`lanes.json`](./lanes.json)
- Version = `{angularMajor}.{stripeJsMajor}.{patch}`
- **Do not hand-edit** the README or docs installation version tables. Run:

```bash
npm run generate:lanes
npm run generate:playground   # StackBlitz lane folders under playground/lanes/
```

CI fails if generated tables / `lanes.data.ts` drift (`npm run generate:lanes:check`).

## Which branch?

| Work | Branch |
| --- | --- |
| Current Angular + current Stripe.js | `main` |
| Older Stripe trains on current Angular | `v22-clover`, `v22-basil`, … (see `lanes.json`) |
| Previous Angular majors | `v21`, `v20`, `v19`, … |

Default: backport Stripe.js line fixes as far as practical across Angular majors.

## Wrapper contract

When Stripe.js adds or changes an API method, update **all three** together:

1. `projects/ngx-stripe/src/lib/interfaces/stripe-instance.interface.ts`
2. `projects/ngx-stripe/src/lib/services/stripe-instance.class.ts`
3. `projects/ngx-stripe/src/lib/services/stripe.service.ts`

Types come from `@stripe/stripe-js`. Do not invent parallel types.

After a Stripe major bump, run `npm run check:stripe-drift` (also listed in the stripe-js-sync maintainer skill).

## What we do not want

- Stripe payment E2E / Elements visual regression suites (Stripe owns that surface)
- Hand-maintained StackBlitz cloud project IDs (use in-repo `playground/lanes/`)
- Secrets in demos — Stripe **test** publishable keys only

## Docs

- Latest-lane demos run in the docs app
- Older lanes: StackBlitz via GitHub import of `playground/lanes/{angular}.{stripeJs}`
- Loud Stripe vs ngx-stripe ownership on docs pages; CSP at `/docs/csp`

## PRs

- Keep diffs focused
- Include or update a contract test when fixing a wrapper bug
- Run `npm test && npm run build:lib && npm run generate:lanes:check` before opening the PR
