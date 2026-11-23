import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  CARD_ELEMENT_CREATE_ONLY_KEYS,
  CARD_NUMBER_ELEMENT_CREATE_ONLY_KEYS,
  PAYMENT_ELEMENT_CREATE_ONLY_KEYS,
  PAYMENT_ELEMENT_NESTED_CREATE_ONLY_KEYS,
  createOnlyCheck,
  omitCreateOnlyOptions
} from './update-options.util';

describe('omitCreateOnlyOptions (#333)', () => {
  afterEach(() => vi.restoreAllMocks());

  it('drops Payment Element create-only options', () => {
    expect(
      omitCreateOnlyOptions({ wallets: { applePay: 'never' }, readOnly: true }, PAYMENT_ELEMENT_CREATE_ONLY_KEYS)
    ).toEqual({ readOnly: true });
  });

  it('drops Card Element create-only options', () => {
    expect(
      omitCreateOnlyOptions(
        { disableLink: true, preferredNetwork: ['cartes_bancaires'], hidePostalCode: true },
        CARD_ELEMENT_CREATE_ONLY_KEYS
      )
    ).toEqual({ hidePostalCode: true });
  });

  it('drops Card Number Element create-only options', () => {
    expect(
      omitCreateOnlyOptions(
        { disableLink: true, preferredNetwork: ['visa'], placeholder: '4242' },
        CARD_NUMBER_ELEMENT_CREATE_ONLY_KEYS
      )
    ).toEqual({ placeholder: '4242' });
  });

  it('passes through options it does not know, such as beta options or ones from a newer stripe-js', () => {
    expect(
      omitCreateOnlyOptions(
        { wallets: { applePay: 'never' }, someNewerOption: { enabled: true }, readOnly: false },
        PAYMENT_ELEMENT_CREATE_ONLY_KEYS,
        undefined,
        PAYMENT_ELEMENT_NESTED_CREATE_ONLY_KEYS
      )
    ).toEqual({ someNewerOption: { enabled: true }, readOnly: false });
  });

  it('keeps an explicit undefined so a caller can clear an updatable option', () => {
    const result = omitCreateOnlyOptions({ readOnly: undefined }, PAYMENT_ELEMENT_CREATE_ONLY_KEYS);
    expect(result).toEqual({ readOnly: undefined });
    expect('readOnly' in result).toBe(true);
  });

  it('drops layout keys that stripe-js 10.3 marks as create-only, keeping the rest of layout', () => {
    expect(
      omitCreateOnlyOptions(
        { layout: { type: 'accordion', defaultCollapsed: false, paymentMethodLogoPosition: 'end', radios: 'never' } },
        PAYMENT_ELEMENT_CREATE_ONLY_KEYS,
        undefined,
        PAYMENT_ELEMENT_NESTED_CREATE_ONLY_KEYS
      )
    ).toEqual({ layout: { type: 'accordion', radios: 'never' } });
  });

  it('passes a string layout through unchanged', () => {
    expect(
      omitCreateOnlyOptions(
        { layout: 'tabs' },
        PAYMENT_ELEMENT_CREATE_ONLY_KEYS,
        undefined,
        PAYMENT_ELEMENT_NESTED_CREATE_ONLY_KEYS
      )
    ).toEqual({ layout: 'tabs' });
  });

  it('accepts missing options', () => {
    expect(omitCreateOnlyOptions(undefined, PAYMENT_ELEMENT_CREATE_ONLY_KEYS)).toEqual({});
  });
});

describe('omitCreateOnlyOptions dev-mode warning', () => {
  afterEach(() => vi.restoreAllMocks());

  it('warns only when a create-only value differs from the one used at creation', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const check = createOnlyCheck('Card Element', 'card-elements', { disableLink: true });

    omitCreateOnlyOptions({ disableLink: true, hidePostalCode: true }, CARD_ELEMENT_CREATE_ONLY_KEYS, check);
    expect(warn).not.toHaveBeenCalled();

    omitCreateOnlyOptions({ disableLink: false }, CARD_ELEMENT_CREATE_ONLY_KEYS, check);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('disableLink can only be set when the Card Element is created');
    expect(warn.mock.calls[0][0]).toContain('https://ngx-stripe.dev/docs/card-elements');
  });

  it('warns about a nested create-only key only when its value changed', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const check = createOnlyCheck('Payment Element', 'payment-element', {
      layout: { type: 'tabs', defaultCollapsed: false }
    });
    const run = (layout: object) =>
      omitCreateOnlyOptions({ layout }, PAYMENT_ELEMENT_CREATE_ONLY_KEYS, check, PAYMENT_ELEMENT_NESTED_CREATE_ONLY_KEYS);

    run({ type: 'accordion', defaultCollapsed: false });
    expect(warn).not.toHaveBeenCalled();

    run({ type: 'accordion', defaultCollapsed: true });
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('layout.defaultCollapsed can only be set when the Payment Element is created');
  });

  it('warns once per new value, not on every later update', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const check = createOnlyCheck('Payment Element', 'payment-element', { wallets: { applePay: 'never' } });
    const run = (wallets: object, name: string) =>
      omitCreateOnlyOptions(
        { wallets, defaultValues: { billingDetails: { name } } },
        PAYMENT_ELEMENT_CREATE_ONLY_KEYS,
        check
      );

    run({ applePay: 'auto' }, 'J');
    run({ applePay: 'auto' }, 'Je');
    run({ applePay: 'auto' }, 'Jen');
    expect(warn).toHaveBeenCalledTimes(1);

    // A different value is a new mistake worth one more warning.
    run({ applePay: 'auto', googlePay: 'never' }, 'Jenn');
    expect(warn).toHaveBeenCalledTimes(2);

    // Going back to the created value, then changing again, warns again.
    run({ applePay: 'never' }, 'Jenny');
    run({ applePay: 'auto' }, 'Jenny');
    expect(warn).toHaveBeenCalledTimes(3);
  });

  it('does not treat a different key order as a change', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const check = createOnlyCheck('Payment Element', 'payment-element', {
      wallets: { applePay: 'never', googlePay: 'auto' }
    });

    omitCreateOnlyOptions({ wallets: { googlePay: 'auto', applePay: 'never' } }, PAYMENT_ELEMENT_CREATE_ONLY_KEYS, check);

    expect(warn).not.toHaveBeenCalled();
  });
});
