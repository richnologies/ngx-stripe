import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { LazyStripeAPILoader } from './api-loader.service';
import { DocumentRef } from './document-ref.service';
import { WindowRef } from './window-ref.service';

describe('LazyStripeAPILoader', () => {
  it('uses the dahlia CDN URL for this release line', () => {
    const appendChild = jasmine.createSpy('appendChild');
    const createElement = jasmine.createSpy('createElement').and.callFake(() => {
      return { type: '', async: false, defer: false, src: '', onload: null, onerror: null };
    });

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
    const script = createElement.calls.mostRecent().returnValue;
    expect(script.src).toBe('https://js.stripe.com/dahlia/stripe.js');
    expect(appendChild).toHaveBeenCalledWith(script);
  });

  it('skips injection on the server platform', () => {
    const createElement = jasmine.createSpy('createElement');
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
              createElement: jasmine.createSpy('createElement'),
              body: { appendChild: jasmine.createSpy('appendChild') }
            })
          }
        }
      ]
    });

    const loader = TestBed.inject(LazyStripeAPILoader);
    loader.load();
    expect(loader.isReady()).toBeTrue();
  });
});
