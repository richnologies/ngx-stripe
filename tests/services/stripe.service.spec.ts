import { inject, TestBed } from '@angular/core/testing';

import { StripeService, WindowRef, STRIPE_PUBLISHABLE_KEY, LazyStripeAPILoader, DocumentRef } from './../../index';

describe('StripeService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                StripeService,
                WindowRef,
                DocumentRef,
                LazyStripeAPILoader,
                {
                    provide: STRIPE_PUBLISHABLE_KEY,
                    useValue: 'test-key'
                }
            ]
        });
    });

    it('should be calculate the sum',
        inject([StripeService, WindowRef],
            (stripeService: StripeService, window: WindowRef) => {
                expect(window.getNativeWindow().hasOwnProperty('Stripe')).toBe(true);
            })
    );

});
