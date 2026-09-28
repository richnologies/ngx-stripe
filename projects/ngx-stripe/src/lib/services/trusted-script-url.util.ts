import { SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

export const STRIPE_JS_SCRIPT_URL = 'https://js.stripe.com/dahlia/stripe.js';

/** Value for HTMLScriptElement.src (TrustedScriptURL may be cast to string for DOM typings). */
export type ScriptSrc = string;

type TrustedTypePolicy = {
  createScriptURL: (url: string) => unknown;
};

type TrustedTypesFactory = {
  /** Chromium may expose getPolicy for already-registered names. */
  getPolicy?: (name: string) => TrustedTypePolicy | null | undefined;
  defaultPolicy?: TrustedTypePolicy | null;
};

const EXISTING_POLICY_NAMES = ['angular#unsafe-bypass', 'angular'] as const;

/**
 * Fallback resolver when a plain string assignment to script.src is rejected
 * (Trusted Types / require-trusted-types-for 'script').
 *
 * Prefer DomSanitizer so Angular's own policies are used. Never createPolicy for
 * `angular` / `angular#unsafe-bypass` — those belong to Angular.
 *
 * Callers should assign the plain CDN URL first and only call this on failure so
 * the common (non–Trusted Types) path stays unchanged.
 */
export function resolveStripeScriptSrc(url: string, sanitizer?: DomSanitizer | null): ScriptSrc {
  if (sanitizer) {
    const bypassed = sanitizer.bypassSecurityTrustResourceUrl(url);
    const sanitized = sanitizer.sanitize(SecurityContext.RESOURCE_URL, bypassed);
    if (sanitized != null) {
      return sanitized;
    }
  }

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

  return url;
}

function getTrustedTypesFactory(): TrustedTypesFactory | undefined {
  if (typeof globalThis === 'undefined') {
    return undefined;
  }

  return (globalThis as { trustedTypes?: TrustedTypesFactory }).trustedTypes;
}
