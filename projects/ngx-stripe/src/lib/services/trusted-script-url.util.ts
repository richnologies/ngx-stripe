export const STRIPE_JS_SCRIPT_URL = 'https://js.stripe.com/dahlia/stripe.js';

/** Own Trusted Types policy — never createPolicy for Angular's reserved names. */
export const NGX_STRIPE_TRUSTED_TYPES_POLICY = 'ngx-stripe';

/** Value for HTMLScriptElement.src (TrustedScriptURL may be cast to string for DOM typings). */
export type ScriptSrc = string;

type TrustedTypePolicy = {
  createScriptURL: (url: string) => unknown;
};

type TrustedTypesFactory = {
  createPolicy?: (
    name: string,
    rules: {
      createHTML?: (value: string) => string;
      createScript?: (value: string) => string;
      createScriptURL?: (value: string) => string;
    }
  ) => TrustedTypePolicy;
  /** Non-standard; present in some Chromium builds. */
  getPolicy?: (name: string) => TrustedTypePolicy | null | undefined;
  defaultPolicy?: TrustedTypePolicy | null;
};

const EXISTING_POLICY_NAMES = ['angular#unsafe-bypass', 'angular'] as const;

/** Cached after first successful createPolicy('ngx-stripe'). */
let ngxStripePolicy: TrustedTypePolicy | null | undefined;

/**
 * Fallback when a plain string assignment to script.src is rejected
 * (Trusted Types / require-trusted-types-for 'script').
 *
 * Order: reuse Angular policies via getPolicy (if available) → defaultPolicy →
 * createPolicy('ngx-stripe') for https://js.stripe.com/ only.
 * DomSanitizer is intentionally unused: sanitize() returns a plain string, which
 * TT still rejects on script.src.
 *
 * Callers should assign the plain CDN URL first and only call this on failure.
 */
export function resolveStripeScriptSrc(url: string): ScriptSrc {
  return resolveScriptSrcWithTrustedTypes(url);
}

function resolveScriptSrcWithTrustedTypes(url: string): ScriptSrc {
  const trustedTypes = getTrustedTypesFactory();
  if (!trustedTypes) {
    return url;
  }

  for (const policyName of EXISTING_POLICY_NAMES) {
    const existing = trustedTypes.getPolicy?.(policyName);
    if (existing?.createScriptURL) {
      return existing.createScriptURL(url) as ScriptSrc;
    }
  }

  if (trustedTypes.defaultPolicy?.createScriptURL) {
    return trustedTypes.defaultPolicy.createScriptURL(url) as ScriptSrc;
  }

  const policy = getOrCreateNgxStripePolicy(trustedTypes);
  if (policy?.createScriptURL) {
    return policy.createScriptURL(url) as ScriptSrc;
  }

  return url;
}

function getOrCreateNgxStripePolicy(trustedTypes: TrustedTypesFactory): TrustedTypePolicy | null {
  if (ngxStripePolicy !== undefined) {
    return ngxStripePolicy;
  }

  ngxStripePolicy = null;
  if (!trustedTypes.createPolicy) {
    return null;
  }

  try {
    ngxStripePolicy = trustedTypes.createPolicy(NGX_STRIPE_TRUSTED_TYPES_POLICY, {
      createHTML: (value: string) => value,
      createScript: (value: string) => value,
      createScriptURL: (value: string) => {
        if (!isAllowedStripeScriptUrl(value)) {
          throw new TypeError(`ngx-stripe Trusted Types policy rejected URL: ${value}`);
        }
        return value;
      }
    });
  } catch {
    // CSP may not allow policy name `ngx-stripe`, or it was already created elsewhere.
  }

  return ngxStripePolicy;
}

function isAllowedStripeScriptUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname === 'js.stripe.com';
  } catch {
    return false;
  }
}

function getTrustedTypesFactory(): TrustedTypesFactory | undefined {
  if (typeof globalThis === 'undefined') {
    return undefined;
  }

  return (globalThis as { trustedTypes?: TrustedTypesFactory }).trustedTypes;
}

/** @internal test helper */
export function resetNgxStripeTrustedTypesPolicyForTests(): void {
  ngxStripePolicy = undefined;
}
