import { afterEach, describe, expect, it, vi } from 'vitest';

import {
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

  it('returns the plain URL when Trusted Types is unavailable', () => {
    (globalThis as { trustedTypes?: unknown }).trustedTypes = undefined;
    expect(resolveStripeScriptSrc(STRIPE_JS_SCRIPT_URL)).toBe(STRIPE_JS_SCRIPT_URL);
  });

  it('creates an ngx-stripe policy for Stripe CDN URLs and caches it', () => {
    const createScriptURL = vi.fn((url: string) => `tt:${url}`);
    const createPolicy = vi.fn((name: string, rules: { createScriptURL: (u: string) => string }) => {
      expect(name).toBe('ngx-stripe');
      expect(rules.createScriptURL(STRIPE_JS_SCRIPT_URL)).toBe(STRIPE_JS_SCRIPT_URL);
      expect(() => rules.createScriptURL('https://evil.example/x.js')).toThrow();
      return { createScriptURL };
    });
    (globalThis as { trustedTypes?: unknown }).trustedTypes = { createPolicy };

    expect(resolveStripeScriptSrc(STRIPE_JS_SCRIPT_URL)).toBe(`tt:${STRIPE_JS_SCRIPT_URL}`);
    expect(resolveStripeScriptSrc(STRIPE_JS_SCRIPT_URL)).toBe(`tt:${STRIPE_JS_SCRIPT_URL}`);
    expect(createPolicy).toHaveBeenCalledTimes(1);
  });
});
