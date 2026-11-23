import { PLATFORM_ID, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { StripeElementsDirective } from '../directives/elements.directive';
import { NGX_STRIPE_VERSION } from '../interfaces/ngx-stripe.interface';
import { NgxStripeModule, provideNgxStripe } from '../ngx-stripe.module';
import { LazyStripeAPILoader } from '../services/api-loader.service';
import { DocumentRef } from '../services/document-ref.service';
import { StripeElementsService } from '../services/stripe-elements.service';
import { StripeFactoryService } from '../services/stripe-factory.service';
import { StripeService } from '../services/stripe.service';
import { WindowRef } from '../services/window-ref.service';

import { injectStripe } from './inject-stripe';
import {
  NGX_STRIPE_CLIENT_SECRET_CHANGED,
  NGX_STRIPE_MISSING_KEY,
  NGX_STRIPE_NOT_PROVIDED,
  ngxStripeScriptLoadFailed
} from './setup-errors';

afterEach(() => vi.restoreAllMocks());

describe('setup errors: ngx-stripe not provided (#193, #218)', () => {
  it.each([
    ['StripeService', StripeService],
    ['StripeElementsService', StripeElementsService],
    ['StripeFactoryService', StripeFactoryService]
  ])('injecting %s without providers names provideNgxStripe', (_name, token) => {
    TestBed.configureTestingModule({});
    expect(() => TestBed.inject(token as typeof StripeService)).toThrow(NGX_STRIPE_NOT_PROVIDED);
  });

  it('optional injection also throws the clear error; NGX_STRIPE_VERSION is the way to ask "is it set up?"', () => {
    TestBed.configureTestingModule({});

    // The root fallback cannot tell an optional injection from a required one. This is intended and
    // documented in the changelog: code that must run without ngx-stripe checks the token first.
    expect(() => TestBed.runInInjectionContext(() => inject(StripeService, { optional: true }))).toThrow(
      NGX_STRIPE_NOT_PROVIDED
    );
    expect(TestBed.runInInjectionContext(() => inject(NGX_STRIPE_VERSION, { optional: true }))).toBeNull();
  });

  it('injectStripe() without providers names provideNgxStripe', () => {
    TestBed.configureTestingModule({});
    expect(() => TestBed.runInInjectionContext(() => injectStripe())).toThrow(NGX_STRIPE_NOT_PROVIDED);
    expect(() => TestBed.runInInjectionContext(() => injectStripe('pk_test_demo'))).toThrow(NGX_STRIPE_NOT_PROVIDED);
  });

  it('provideNgxStripe() still provides the real services', () => {
    TestBed.configureTestingModule({ providers: [provideNgxStripe('pk_test_demo')] });

    const service = TestBed.inject(StripeService);
    expect(service).toBeInstanceOf(StripeService);
    expect(service.key).toBe('pk_test_demo');
    expect(TestBed.inject(StripeElementsService)).toBeInstanceOf(StripeElementsService);
    expect(TestBed.inject(StripeFactoryService)).toBeInstanceOf(StripeFactoryService);
  });

  it('NgxStripeModule.forRoot() still provides the real services', () => {
    TestBed.configureTestingModule({ imports: [NgxStripeModule.forRoot('pk_test_module')] });

    expect(TestBed.inject(StripeService).key).toBe('pk_test_module');
  });
});

describe('setup errors: no publishable key (#263)', () => {
  it('injectStripe() with no key anywhere explains where the key goes', () => {
    TestBed.configureTestingModule({ providers: [provideNgxStripe()] });
    expect(() => TestBed.runInInjectionContext(() => injectStripe())).toThrow(NGX_STRIPE_MISSING_KEY);
  });

  it('injectStripe(key) works without a global key', () => {
    TestBed.configureTestingModule({ providers: [provideNgxStripe()] });
    const stripe = TestBed.runInInjectionContext(() => injectStripe('pk_test_local'));
    expect(typeof stripe.confirmPayment).toBe('function');
  });

  it('StripeFactoryService.create() with no key anywhere uses the same message', () => {
    TestBed.configureTestingModule({ providers: [provideNgxStripe()] });
    expect(() => TestBed.inject(StripeFactoryService).create()).toThrow(NGX_STRIPE_MISSING_KEY);
  });
});

describe('setup errors: Stripe.js blocked (#202, #238, #265)', () => {
  it('logs the CSP docs when the script fails to load', () => {
    const script = { type: '', async: false, defer: false, src: '', onload: null, onerror: null as null | (() => void) };
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    TestBed.configureTestingModule({
      providers: [
        LazyStripeAPILoader,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: WindowRef, useValue: { getNativeWindow: () => ({}) } },
        {
          provide: DocumentRef,
          useValue: { getNativeDocument: () => ({ createElement: () => script, body: { appendChild: vi.fn() } }) }
        }
      ]
    });

    const loader = TestBed.inject(LazyStripeAPILoader);
    loader.load();
    script.onerror!();

    expect(error).toHaveBeenCalledWith(ngxStripeScriptLoadFailed('https://js.stripe.com/endive/stripe.js'));
    expect(ngxStripeScriptLoadFailed('x')).toContain('https://ngx-stripe.dev/docs/csp');
    expect(loader.status.getValue()).toEqual({ loaded: false, loading: false, error: true });
  });
});

describe('setup errors: clientSecret set after Elements exists (#161, #267)', () => {
  function change(currentValue: unknown, previousValue: unknown) {
    return { currentValue, previousValue, firstChange: previousValue === undefined, isFirstChange: () => previousValue === undefined };
  }

  async function createdDirective(initial: Record<string, unknown>) {
    const stripeElements = { update: vi.fn() };
    const service = { elements: vi.fn(() => of(stripeElements)) };
    const directive = new StripeElementsDirective(service as unknown as StripeElementsService);
    directive.stripe = {} as StripeElementsDirective['stripe'];
    directive.elementsOptions = initial;
    await directive.ngOnChanges({ elementsOptions: change(initial, undefined) });
    return { directive, stripeElements };
  }

  it('warns when the clientSecret changes after the Elements group was created', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const initial = { locale: 'en' };
    const { directive } = await createdDirective(initial);

    const next = { locale: 'en', clientSecret: 'pi_123_secret_456' };
    directive.elementsOptions = next as never;
    await directive.ngOnChanges({ elementsOptions: change(next, initial) });

    expect(warn).toHaveBeenCalledWith(NGX_STRIPE_CLIENT_SECRET_CHANGED);
  });

  it('stays quiet for option updates Stripe can apply', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const initial = { locale: 'en', clientSecret: 'pi_123_secret_456' };
    const { directive, stripeElements } = await createdDirective(initial);

    const next = { locale: 'fr', clientSecret: 'pi_123_secret_456' };
    directive.elementsOptions = next as never;
    await directive.ngOnChanges({ elementsOptions: change(next, initial) });

    expect(warn).not.toHaveBeenCalled();
    expect(stripeElements.update).toHaveBeenCalledWith({ locale: 'fr' });
  });
});
