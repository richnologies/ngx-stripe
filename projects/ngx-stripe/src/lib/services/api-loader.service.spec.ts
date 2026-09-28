import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { LazyStripeAPILoader } from './api-loader.service';
import { DocumentRef } from './document-ref.service';
import { WindowRef } from './window-ref.service';
import { NGX_STRIPE_TRUSTED_TYPES_POLICY, resetNgxStripeTrustedTypesPolicyForTests } from './trusted-script-url.util';

describe('LazyStripeAPILoader', () => {
  afterEach(() => {
    resetNgxStripeTrustedTypesPolicyForTests();
    delete (globalThis as { trustedTypes?: unknown }).trustedTypes;
  });

  it('uses the dahlia CDN URL for this release line', () => {
    const script = { type: '', async: false, defer: false, src: '', onload: null, onerror: null };
    const appendChild = vi.fn();
    const createElement = vi.fn().mockReturnValue(script);

    TestBed.configureTestingModule({
      providers: [
        LazyStripeAPILoader,
        { provide: PLATFORM_ID, useValue: 'browser' },
        {
          provide: WindowRef,
          useValue: { getNativeWindow: () => ({}) }
        },
        {
          provide: DocumentRef,
          useValue: {
            getNativeDocument: () => ({
              createElement,
              body: { appendChild }
            })
          }
        }
      ]
    });

    const loader = TestBed.inject(LazyStripeAPILoader);
    loader.load();

    expect(createElement).toHaveBeenCalledWith('script');
    expect(script.src).toBe('https://js.stripe.com/dahlia/stripe.js');
    expect(appendChild).toHaveBeenCalledWith(script);
  });

  it('falls back to ngx-stripe Trusted Types policy when plain assignment is rejected', () => {
    let assignCount = 0;
    const script = {
      type: '',
      async: false,
      defer: false,
      onload: null as (() => void) | null,
      onerror: null as (() => void) | null,
      get src() {
        return (this as { _src?: string })._src ?? '';
      },
      set src(value: string) {
        assignCount += 1;
        if (assignCount === 1 && typeof value === 'string' && !value.startsWith('trusted:')) {
          throw new TypeError("This document requires 'TrustedScriptURL' assignment");
        }
        (this as { _src?: string })._src = value;
      }
    };
    const createElement = vi.fn().mockReturnValue(script);
    const createScriptURL = vi.fn((url: string) => `trusted:${url}`);
    (globalThis as { trustedTypes?: unknown }).trustedTypes = {
      createPolicy: vi.fn((name: string) => {
        expect(name).toBe(NGX_STRIPE_TRUSTED_TYPES_POLICY);
        return { createScriptURL };
      }),
      getPolicy: () => null
    };

    TestBed.configureTestingModule({
      providers: [
        LazyStripeAPILoader,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: WindowRef, useValue: { getNativeWindow: () => ({}) } },
        {
          provide: DocumentRef,
          useValue: {
            getNativeDocument: () => ({
              createElement,
              body: { appendChild: vi.fn() }
            })
          }
        }
      ]
    });

    TestBed.inject(LazyStripeAPILoader).load();

    expect(createScriptURL).toHaveBeenCalledWith('https://js.stripe.com/dahlia/stripe.js');
    expect(script.src).toBe('trusted:https://js.stripe.com/dahlia/stripe.js');
  });

  it('marks error when Trusted Types fallback also fails', () => {
    const script = {
      type: '',
      async: false,
      defer: false,
      onload: null as (() => void) | null,
      onerror: null as (() => void) | null,
      set src(_value: string) {
        throw new TypeError("This document requires 'TrustedScriptURL' assignment");
      },
      get src() {
        return '';
      }
    };
    const createElement = vi.fn().mockReturnValue(script);
    (globalThis as { trustedTypes?: unknown }).trustedTypes = undefined;

    TestBed.configureTestingModule({
      providers: [
        LazyStripeAPILoader,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: WindowRef, useValue: { getNativeWindow: () => ({}) } },
        {
          provide: DocumentRef,
          useValue: {
            getNativeDocument: () => ({
              createElement,
              body: { appendChild: vi.fn() }
            })
          }
        }
      ]
    });

    const loader = TestBed.inject(LazyStripeAPILoader);
    loader.load();
    expect(loader.status.getValue()).toEqual({ loaded: false, loading: false, error: true });
  });

  it('skips injection on the server platform', () => {
    const createElement = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        LazyStripeAPILoader,
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: WindowRef, useValue: { getNativeWindow: () => ({}) } },
        {
          provide: DocumentRef,
          useValue: { getNativeDocument: () => ({ createElement, body: { appendChild: () => undefined } }) }
        }
      ]
    });

    TestBed.inject(LazyStripeAPILoader).load();
    expect(createElement).not.toHaveBeenCalled();
  });

  it('marks loaded when window.Stripe already exists', () => {
    TestBed.configureTestingModule({
      providers: [
        LazyStripeAPILoader,
        { provide: PLATFORM_ID, useValue: 'browser' },
        {
          provide: WindowRef,
          useValue: { getNativeWindow: () => ({ Stripe: function Stripe() {} }) }
        },
        {
          provide: DocumentRef,
          useValue: {
            getNativeDocument: () => ({
              createElement: vi.fn(),
              body: { appendChild: vi.fn() }
            })
          }
        }
      ]
    });

    const loader = TestBed.inject(LazyStripeAPILoader);
    loader.load();
    expect(loader.isReady()).toBe(true);
  });
});
