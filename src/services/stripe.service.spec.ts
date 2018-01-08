import { inject, TestBed } from '@angular/core/testing';
import {
  LazyStripeAPILoader,
  StripeService,
  WindowRef,
  DocumentRef,
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_OPTIONS
} from '../../index';

describe('StripeService', () => {
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
});
