import { describe, expect, it, vi } from 'vitest';

import { destroyStripeElement } from './destroy-stripe-element.util';

describe('destroyStripeElement', () => {
  it('no-ops when the element is null or undefined', () => {
    expect(() => destroyStripeElement(null)).not.toThrow();
    expect(() => destroyStripeElement(undefined)).not.toThrow();
  });

  it('calls destroy on a live element', () => {
    const destroy = vi.fn();
    destroyStripeElement({ destroy });
    expect(destroy).toHaveBeenCalledTimes(1);
  });

  it('ignores Stripe IntegrationErrors for already-destroyed elements', () => {
    const destroy = vi.fn(() => {
      throw new Error('This Element has already been destroyed.');
    });
    expect(() => destroyStripeElement({ destroy })).not.toThrow();
    expect(destroy).toHaveBeenCalledTimes(1);
  });

  it('ignores already-destroyed errors regardless of message casing', () => {
    const destroy = vi.fn(() => {
      throw new Error('this element has already been destroyed');
    });
    expect(() => destroyStripeElement({ destroy })).not.toThrow();
  });

  it('rethrows unexpected destroy errors', () => {
    const destroy = vi.fn(() => {
      throw new Error('network failure');
    });
    expect(() => destroyStripeElement({ destroy })).toThrow('network failure');
  });
});
