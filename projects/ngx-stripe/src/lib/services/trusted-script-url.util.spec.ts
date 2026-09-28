import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  NGX_STRIPE_TRUSTED_TYPES_POLICY,
  resetNgxStripeTrustedTypesPolicyForTests,
  resolveStripeScriptSrc,
  STRIPE_JS_SCRIPT_URL
} from './trusted-script-url.util';

describe('resolveStripeScriptSrc', () => {
  const originalTrustedTypes = (globalThis as { trustedTypes?: unknown }).trustedTypes;

  afterEach(() => {
    (globalThis as { trustedTypes?: unknown }).trustedTypes = originalTrustedTypes;
    resetNgxStripeTrustedTypesPolicyForTests();
  });

  it('returns the plain URL when Trusted Types helpers are unavailable', () => {
    (globalThis as { trustedTypes?: unknown }).trustedTypes = undefined;
    expect(resolveStripeScriptSrc(STRIPE_JS_SCRIPT_URL)).toBe(STRIPE_JS_SCRIPT_URL);
  });

  it('reuses an existing Angular policy via getPolicy without createPolicy', () => {
    const createScriptURL = vi.fn((url: string) => `trusted:${url}`);
    const createPolicy = vi.fn();
    (globalThis as { trustedTypes?: unknown }).trustedTypes = {
      createPolicy,
      getPolicy: (name: string) =>
        name === 'angular#unsafe-bypass' ? { createScriptURL } : null
    };

    expect(resolveStripeScriptSrc(STRIPE_JS_SCRIPT_URL)).toBe(`trusted:${STRIPE_JS_SCRIPT_URL}`);
    expect(createPolicy).not.toHaveBeenCalled();
    expect(createScriptURL).toHaveBeenCalledWith(STRIPE_JS_SCRIPT_URL);
  });

  it('uses defaultPolicy when named Angular policies are missing', () => {
    const createScriptURL = vi.fn((url: string) => `default:${url}`);
    (globalThis as { trustedTypes?: unknown }).trustedTypes = {
      getPolicy: () => null,
      defaultPolicy: { createScriptURL }
    };

    expect(resolveStripeScriptSrc(STRIPE_JS_SCRIPT_URL)).toBe(`default:${STRIPE_JS_SCRIPT_URL}`);
  });

  it('creates an ngx-stripe policy that accepts Stripe CDN URLs', () => {
    const createScriptURL = vi.fn((url: string) => `ngx:${url}`);
    const createPolicy = vi.fn((_name: string, rules: { createScriptURL: (u: string) => string }) => {
      expect(_name).toBe(NGX_STRIPE_TRUSTED_TYPES_POLICY);
      // Exercise the allowlist inside the policy rules
      expect(rules.createScriptURL(STRIPE_JS_SCRIPT_URL)).toBe(STRIPE_JS_SCRIPT_URL);
      expect(() => rules.createScriptURL('https://evil.example/x.js')).toThrow();
      return { createScriptURL };
    });
    (globalThis as { trustedTypes?: unknown }).trustedTypes = {
      createPolicy,
      getPolicy: () => null
    };

    expect(resolveStripeScriptSrc(STRIPE_JS_SCRIPT_URL)).toBe(`ngx:${STRIPE_JS_SCRIPT_URL}`);
    expect(createPolicy).toHaveBeenCalledTimes(1);
    // Second call reuses the cached policy
    expect(resolveStripeScriptSrc(STRIPE_JS_SCRIPT_URL)).toBe(`ngx:${STRIPE_JS_SCRIPT_URL}`);
    expect(createPolicy).toHaveBeenCalledTimes(1);
  });
});
