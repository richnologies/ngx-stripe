# ngx-stripe — guide for coding agents

ngx-stripe is a public, MIT-licensed Angular wrapper around Stripe.js, published to npm as `ngx-stripe`. People install it in payment flows. Prefer a small, complete change over a broad one, and read [CONTRIBUTING.md](./CONTRIBUTING.md) first: it is the source of truth and this file only adds what an agent needs to know.

## What the library does

1. Loads Stripe.js lazily from Stripe's CDN, by named version.
2. Wraps the `Stripe` object as RxJS Observables (`StripeService`, `StripeInstance`).
3. Ships standalone Angular components and directives for Stripe Elements.
4. Re-exports types from `@stripe/stripe-js`. It does not define payment types of its own.

## Map

| Path | What it is |
| --- | --- |
| `projects/ngx-stripe/src/lib` | The library: `components/`, `directives/`, `services/`, `interfaces/` |
| `projects/ngx-stripe/src/public_api.ts` | Everything consumers can import. Frozen by `projects/ngx-stripe/public-api.snapshot.json` |
| `projects/ngx-stripe-docs` | The docs site (ngx-stripe.dev) and its live demos |
| `lanes.json` | Supported Angular × Stripe.js combinations. Source of the version tables |
| `elements-inventory.json` | Catalog of Elements. Source of the docs catalog, `llms.txt` and `skills/ngx-stripe/elements.md` |
| `playground/lanes` | Generated StackBlitz projects for older lanes |
| `scripts/` | Generators and checks used by CI |
| `smoke/` | Playwright smoke tests for the docs site |
| `projects/ngx-stripe/schematics` | The `ng add ngx-stripe` schematic. Built into the package by `build:lib`, tested in Node by `npm run test:schematics` |
| `deploy/docs` | How the docs site is served (nginx). Deploying is the maintainer's |

This is an Angular CLI workspace, not Nx. Node 22, npm.

## Commands

```bash
npm ci                           # .npmrc sets legacy-peer-deps; keep it
npm test                         # Vitest contract tests (jsdom) + ng add schematic tests (builds the library first)
npm run build:lib                # ng-packagr build into dist/ngx-stripe
npm run generate:lanes:check     # generated version tables are current
npm run generate:elements:check  # generated Element catalog is current
npm run pack:smoke               # the packed tarball exposes the public API
npm run check:pack-allowlist     # nothing unexpected ships in the tarball
npm run check:public-api         # exported names match the snapshot
npm run check:stripe-drift       # every Stripe method is wrapped
npm run build:app                # docs site builds
npm run smoke:docs               # Playwright against the docs (needs `npx playwright install chromium`)
```

Before calling a change done, run at least `npm test && npm run build:lib && npm run generate:lanes:check && npm run generate:elements:check`. CI runs the whole list.

`npm run lint` does not work at the moment (the configured builder no longer exists). Do not count on it and do not "fix" formatting by hand; Prettier settings are in `.prettierrc` (120 columns, single quotes).

## Rules

1. **The wrapper contract.** When Stripe.js adds or changes a method, change these three together: `interfaces/stripe-instance.interface.ts`, `services/stripe-instance.class.ts`, `services/stripe.service.ts`. Then run `npm run check:stripe-drift`.
2. **Types come from `@stripe/stripe-js`.** Do not write parallel types.
3. **Generated files are generated.** Do not hand-edit the version tables in the READMEs or docs, `lanes.data.ts`, `playground/lanes`, `llms.txt`, or `skills/ngx-stripe/elements.md`. Edit `lanes.json` or `elements-inventory.json` and run `npm run generate:lanes`, `generate:playground` or `generate:elements`.
4. **The public API is a promise.** A new export needs `public_api.ts`, registration in `ngx-stripe.module.ts` where it applies, and an intentional snapshot update (`node scripts/check-public-api.mjs --update`). Removing or renaming an export is a breaking change: stop and ask.
5. **A wrapper bug fix comes with a contract test** next to the code (`*.spec.ts`).
6. **A new Element** starts from the closest existing standalone component and is added to `elements-inventory.json`.
7. **Only Stripe test publishable keys** in demos and tests. No secret keys anywhere, ever.
8. **No Stripe payment end-to-end or visual regression suites.** Stripe owns that surface.
9. **Work on `main`** unless told otherwise. Version = `{angularMajor}.{stripeJsMajor}.{patch}`; other lanes live on the branches listed in `lanes.json`, and backports are the maintainer's decision.

## What an agent never does here

- Publish: no `npm publish`, no `npm run publish`, no `npm stage`, no running the `publish.yml` workflow, no change to dist-tags. Releases are staged and approved by the maintainer.
- Deploy the docs site (`npm run deploy:docs`). It changes ngx-stripe.dev for everyone; the maintainer deploys.
- Bump the version in `projects/ngx-stripe/package.json` or edit `CHANGELOG.md` release entries, unless the task is a release prepared with the maintainer.
- Push, open or merge pull requests, comment on or close issues, or change labels, unless the maintainer asked for that exact action.
- Weaken a check (allowlists in `scripts/`, the public API snapshot, `lanes.json` support levels) to make CI green.
- Report a security problem in a public issue. See [SECURITY.md](./SECURITY.md).

## When unsure

Say what you found and stop. A wrong release of this package reaches other people's checkout pages.
