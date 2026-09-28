import { SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { resolveStripeScriptSrc, STRIPE_JS_SCRIPT_URL } from './trusted-script-url.util';

describe('resolveStripeScriptSrc', () => {
  const originalTrustedTypes = (globalThis as { trustedTypes?: unknown }).trustedTypes;

  afterEach(() => {
    (globalThis as { trustedTypes?: unknown }).trustedTypes = originalTrustedTypes;
  });

  it('returns the sanitize result when DomSanitizer is provided', () => {
    const sanitizer = {
      bypassSecurityTrustResourceUrl: vi.fn((url: string) => ({ bypass: url })),
      sanitize: vi.fn((_ctx: SecurityContext, value: unknown) => {
        expect(_ctx).toBe(SecurityContext.RESOURCE_URL);
        return `sanitized:${(value as { bypass: string }).bypass}`;
      })
    } as unknown as DomSanitizer;

    expect(resolveStripeScriptSrc(STRIPE_JS_SCRIPT_URL, sanitizer)).toBe(
      `sanitized:${STRIPE_JS_SCRIPT_URL}`
    );
    expect(sanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(STRIPE_JS_SCRIPT_URL);
  });

  it('falls back to plain URL when Trusted Types is unavailable', () => {
    (globalThis as { trustedTypes?: unknown }).trustedTypes = undefined;
    expect(resolveStripeScriptSrc(STRIPE_JS_SCRIPT_URL, null)).toBe(STRIPE_JS_SCRIPT_URL);
  });

  it('reuses an existing Angular policy via getPolicy without createPolicy', () => {
    const createScriptURL = vi.fn((url: string) => `trusted:${url}`);
    const createPolicy = vi.fn();
    (globalThis as { trustedTypes?: unknown }).trustedTypes = {
      createPolicy,
      getPolicy: (name: string) =>
        name === 'angular#unsafe-bypass' ? { createScriptURL } : null
    };

    expect(resolveStripeScriptSrc(STRIPE_JS_SCRIPT_URL, null)).toBe(`trusted:${STRIPE_JS_SCRIPT_URL}`);
    expect(createPolicy).not.toHaveBeenCalled();
    expect(createScriptURL).toHaveBeenCalledWith(STRIPE_JS_SCRIPT_URL);
  });

  it('uses defaultPolicy when named Angular policies are missing', () => {
    const createScriptURL = vi.fn((url: string) => `default:${url}`);
    (globalThis as { trustedTypes?: unknown }).trustedTypes = {
      getPolicy: () => null,
      defaultPolicy: { createScriptURL }
    };

    expect(resolveStripeScriptSrc(STRIPE_JS_SCRIPT_URL, null)).toBe(`default:${STRIPE_JS_SCRIPT_URL}`);
  });
});
