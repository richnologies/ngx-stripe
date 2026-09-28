import { StripeInstance } from '../services/stripe-instance.class';
import { StripeService } from '../services/stripe.service';

/**
 * Contract: public instance methods that wrap Stripe should exist on both
 * StripeInstance and StripeService (parity check — does not call Stripe.js).
 */
const WRAPPER_METHODS = [
  'elements',
  'confirmPayment',
  'confirmSetup',
  'createToken',
  'createPaymentMethod',
  'paymentRequest',
  'retrievePaymentIntent',
  'retrieveSetupIntent'
] as const;

describe('StripeServiceInterface parity', () => {
  it('keeps StripeInstance and StripeService method names aligned', () => {
    for (const name of WRAPPER_METHODS) {
      expect(typeof (StripeInstance.prototype as any)[name])
        .withContext(`StripeInstance missing ${name}`)
        .toBe('function');
      expect(typeof (StripeService.prototype as any)[name])
        .withContext(`StripeService missing ${name}`)
        .toBe('function');
    }
  });
});
