import { PLATFORM_ID } from '@angular/core';
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
