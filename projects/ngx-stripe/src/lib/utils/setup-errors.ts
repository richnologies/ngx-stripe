/**
 * Messages for the setup mistakes people hit most often (see issues #193, #202, #218, #263, #267).
 * Each one names the fix and links to the docs page that explains it. Internal: not exported.
 */
const DOCS = 'https://ngx-stripe.dev/docs';

export const NGX_STRIPE_NOT_PROVIDED =
  '[ngx-stripe] ngx-stripe is not provided. Add provideNgxStripe() to your application providers ' +
  '(app.config.ts), or NgxStripeModule.forRoot() to the imports of an NgModule app. ' +
  `\`ng add ngx-stripe\` does this for you. See ${DOCS}/setup-application`;

export const NGX_STRIPE_MISSING_KEY =
  "[ngx-stripe] No Stripe publishable key. Pass one to provideNgxStripe('pk_test_…') " +
  "(or NgxStripeModule.forRoot('pk_test_…')), or to injectStripe('pk_test_…') for a single instance. " +
  `See ${DOCS}/setup-application`;

export function ngxStripeScriptLoadFailed(url: string): string {
  return (
    `[ngx-stripe] Stripe.js could not be loaded from ${url}. A Content Security Policy, an ad blocker ` +
    'or the network blocked it, so no Stripe Element will render and Stripe calls will not complete. ' +
    `See ${DOCS}/csp`
  );
}

export const NGX_STRIPE_TRUSTED_TYPES_REJECTED =
  '[ngx-stripe] Trusted Types rejected the Stripe.js script URL, so Stripe.js was not loaded. ' +
  `Allow the \`ngx-stripe\` policy in your Content Security Policy (trusted-types ngx-stripe). See ${DOCS}/csp`;

export const NGX_STRIPE_CLIENT_SECRET_CHANGED =
  '[ngx-stripe] elementsOptions.clientSecret changed after <ngx-stripe-elements> created its Elements group. ' +
  'Stripe cannot change the client secret of an existing group, so the new value is ignored. ' +
  'Render <ngx-stripe-elements> only once the clientSecret is known, ' +
  `for example inside @if (elementsOptions.clientSecret). See ${DOCS}/payment-element`;

export function ngxStripeCreateOnlyOptionsChanged(element: string, keys: string[], docsPath: string): string {
  const names = keys.join(', ');
  return (
    `[ngx-stripe] ${names} can only be set when the ${element} is created, so the new value is ignored. ` +
    'To apply it, create the element again, for example by rendering it inside @if and toggling the condition. ' +
    `See ${DOCS}/${docsPath}`
  );
}

/**
 * Root fallback for ngx-stripe's injectables. It only runs when no injector provides the service,
 * which used to end in "NullInjectorError: No provider for StripeService".
 */
export function ngxStripeNotProvided(): never {
  throw new Error(NGX_STRIPE_NOT_PROVIDED);
}
