import { inject, TestBed } from '@angular/core/testing';

import {
  WindowRef,
  DocumentRef,
  LazyStripeAPILoader,
  StripeService,
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_OPTIONS
} from './../../index';

describe('StripeLaoderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StripeService,
        LazyStripeAPILoader,
        WindowRef,
        DocumentRef,
        {
          provide: STRIPE_PUBLISHABLE_KEY,
          useValue: 'test-key'
        },
        {
          provide: STRIPE_OPTIONS,
          useValue: 'stripe-options'
        }
      ]
    });
  });

  it(
    'should load the Stripe Library when the service is injected',
    inject(
      [StripeService, WindowRef],
      (stripe: StripeService, window: WindowRef) => {
        console.log(window.getNativeWindow().Stripe);
        expect(window.getNativeWindow().hasOwnProperty('Stripe')).toBe(true);
      }
    )
  );
});
