/** Title of the home page, and of any route without a `title` in its route data. */
export const NGSTR_DEFAULT_TITLE = 'ngx-stripe · Stripe.js for Angular: Payment Element, Elements and Checkout';

/** Appended to a route's `title`. Carries the package name and the two words people search for. */
export const NGSTR_TITLE_SUFFIX = 'ngx-stripe · Stripe.js for Angular';

export const NGSTR_DEFAULT_DESCRIPTION =
  'ngx-stripe is the Angular wrapper for Stripe.js: standalone components for Payment Element, Express Checkout and every Stripe Element, plus an Observable StripeService.';

/** Square logo. Social previews use the small `summary` card until a 1200×630 image exists. */
export const NGSTR_SOCIAL_IMAGE_PATH = '/assets/img/ngx-stripe-logo.png';

/**
 * Meta descriptions by path. Element pages are not listed here: theirs comes from the
 * `summary` in elements-inventory.json, so the catalog stays the single source.
 */
export const NGSTR_PAGE_DESCRIPTIONS: Record<string, string> = {
  '/': NGSTR_DEFAULT_DESCRIPTION,
  '/docs/introduction':
    'What ngx-stripe is and what it wraps: Stripe.js and Stripe Elements for Angular, with standalone components, Observables and types from @stripe/stripe-js.',
  '/docs/installation':
    'Install ngx-stripe and @stripe/stripe-js in an Angular app. Install commands and the release matrix for every supported Angular and Stripe.js version.',
  '/docs/versioning':
    'How ngx-stripe versions map to Angular majors and Stripe.js named versions, and how to pick the right release line and npm dist-tag for your app.',
  '/docs/setup-application':
    'Set up Stripe in an Angular application: provideNgxStripe with your publishable key, injectStripe, and NgxStripeModule for NgModule-based apps.',
  '/docs/first-payment':
    'Collect your first Stripe payment in Angular, step by step: provideNgxStripe, the Elements container, Payment Element or Card Element, and confirmPayment.',
  '/docs/elements':
    'The ngx-stripe-elements container and the full catalog of Stripe Elements available as Angular standalone components, with selectors and options.',
  '/docs/issuing-elements':
    'Stripe Issuing Elements for Angular: display card number, expiry, CVC, PIN and a copy button with ngx-stripe standalone components.',
  '/docs/card-elements':
    'Stripe Card Element in Angular with ngx-stripe: the single-line card input, split number, expiry and CVC fields, and confirming a card payment.',
  '/docs/payment-request-button':
    'Payment Request Button in ngx-stripe: where it is still available, why it was removed on Stripe.js v10, and how to move to the Express Checkout Element.',
  '/docs/checkout':
    'Stripe Checkout from Angular with ngx-stripe: redirect to a hosted Checkout Session or mount embedded Checkout inside your application.',
  '/docs/identity':
    'Stripe Identity in Angular with ngx-stripe: create a verification session on your server and start document verification from a component.',
  '/docs/service':
    'StripeService API reference for Angular: every Stripe.js method wrapped as an RxJS Observable, from confirmPayment and confirmSetup to createToken.',
  '/docs/styling':
    'Style Stripe Elements in Angular: the Appearance API, element style options and container classes with ngx-stripe, and what Stripe controls.',
  '/docs/reference-instance':
    'Access the underlying Stripe.js instance from ngx-stripe, and create extra Stripe instances for multiple publishable keys or Stripe Connect accounts.',
  '/docs/manually-mount-your-element':
    'Create and mount a Stripe Element yourself in Angular with StripeService and the Elements object, for cases the ngx-stripe components do not cover.',
  '/docs/faqs':
    'Frequently asked questions about using Stripe with Angular through ngx-stripe: setup errors, client secrets, styling, versions and common pitfalls.',
  '/docs/csp':
    'Content Security Policy for Stripe.js in Angular: the script, frame and connect sources Stripe needs, and how ngx-stripe loads the Stripe.js script.',
  '/docs/support':
    'ngx-stripe support policy: which Angular and Stripe.js versions get active releases, maintenance fixes or long-term-support tags, and how to get help.',
  '/docs/examples':
    'Working ngx-stripe examples for Angular: Payment Element, Card Elements, Express Checkout, Address, IBAN, Issuing and more, each with its source.',
  '/docs/migration':
    'Migrate between ngx-stripe versions: breaking changes by Angular major and Stripe.js version, with the code changes each upgrade needs.'
};
