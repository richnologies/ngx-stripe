import { PLATFORM_ID, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';

import { LazyStripeAPILoader } from './api-loader.service';
import { DocumentRef } from './document-ref.service';
import { WindowRef } from './window-ref.service';

describe('LazyStripeAPILoader', () => {
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

  it('keeps the plain CDN URL when DomSanitizer is present (common path)', () => {
    const script = { type: '', async: false, defer: false, src: '', onload: null, onerror: null };
    const createElement = vi.fn().mockReturnValue(script);
    const sanitizer = {
      bypassSecurityTrustResourceUrl: vi.fn(),
      sanitize: vi.fn()
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
        },
        { provide: DomSanitizer, useValue: sanitizer }
      ]
    });

    TestBed.inject(LazyStripeAPILoader).load();

    expect(script.src).toBe('https://js.stripe.com/dahlia/stripe.js');
    expect(sanitizer.bypassSecurityTrustResourceUrl).not.toHaveBeenCalled();
  });

  it('falls back to DomSanitizer when plain script.src assignment is rejected', () => {
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
        if (assignCount === 1) {
          throw new TypeError('This document requires \'TrustedScriptURL\' assignment');
        }
        (this as { _src?: string })._src = value;
      }
    };
    const createElement = vi.fn().mockReturnValue(script);
    const sanitizer = {
      bypassSecurityTrustResourceUrl: vi.fn((url: string) => ({ bypass: url })),
      sanitize: vi.fn((_ctx: SecurityContext, value: { bypass: string }) => value.bypass)
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
        },
        { provide: DomSanitizer, useValue: sanitizer }
      ]
    });

    TestBed.inject(LazyStripeAPILoader).load();

    expect(sanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(
      'https://js.stripe.com/dahlia/stripe.js'
    );
    expect(script.src).toBe('https://js.stripe.com/dahlia/stripe.js');
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
