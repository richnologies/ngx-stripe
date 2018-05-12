import { TestBed } from '@angular/core/testing';
import {
  DocumentRef,
  LazyStripeAPILoader,
  STRIPE_OPTIONS,
  STRIPE_PUBLISHABLE_KEY,
  StripeService,
  WindowRef
} from '../ngx-stripe';

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
