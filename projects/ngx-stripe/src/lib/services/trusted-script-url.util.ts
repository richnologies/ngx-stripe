export const STRIPE_JS_SCRIPT_URL = 'https://js.stripe.com/endive/stripe.js';

const POLICY_NAME = 'ngx-stripe';

type Policy = { createScriptURL: (url: string) => unknown };

let cachedPolicy: Policy | null | undefined;

/**
 * TrustedScriptURL for the Stripe.js CDN when plain `script.src = url` is rejected.
 * Creates policy `ngx-stripe` (https://js.stripe.com only). Allow that name in CSP.
 */
export function resolveStripeScriptSrc(url: string): string {
  const trustedTypes = (globalThis as { trustedTypes?: { createPolicy?: Function } }).trustedTypes;
  if (!trustedTypes?.createPolicy) {
    return url;
  }

  if (cachedPolicy === undefined) {
    cachedPolicy = null;
    try {
      cachedPolicy = trustedTypes.createPolicy(POLICY_NAME, {
        createScriptURL: (value: string) => {
          if (!isStripeCdn(value)) {
            throw new TypeError(`ngx-stripe rejected URL: ${value}`);
          }
          return value;
        }
      }) as Policy;
    } catch {
      // CSP may omit `ngx-stripe`, or the policy already exists.
    }
  }

  return (cachedPolicy?.createScriptURL(url) as string) ?? url;
}

function isStripeCdn(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname === 'js.stripe.com';
  } catch {
    return false;
  }
}

/** @internal */
export function resetNgxStripeTrustedTypesPolicyForTests(): void {
  cachedPolicy = undefined;
}
