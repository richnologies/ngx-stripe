import { inject, TestBed } from '@angular/core/testing';

import {
  DocumentRef,
  LazyStripeAPILoader,
  STRIPE_OPTIONS,
  STRIPE_PUBLISHABLE_KEY,
  StripeService,
  WindowRef
} from '../ngx-stripe';


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
    'should load the Stripe Library when call the elements function in the service',
    inject(
      [StripeService, WindowRef],
      (stripeService: StripeService, window: WindowRef) => {
        stripeService.elements().subscribe(() => {
          expect(window.getNativeWindow().hasOwnProperty('Stripe')).toBe(true);
        });
      }
    )
  );
});
