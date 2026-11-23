import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  CARD_ELEMENT_UPDATE_KEYS,
  CARD_NUMBER_ELEMENT_UPDATE_KEYS,
  PAYMENT_ELEMENT_UPDATE_KEYS,
  pickUpdateOptions
} from './update-options.util';

describe('pickUpdateOptions (#333)', () => {
  afterEach(() => vi.restoreAllMocks());

  it('drops Payment Element create-only options', () => {
    expect(
      pickUpdateOptions({ wallets: { applePay: 'never' }, readOnly: true, classes: { base: 'x' } }, PAYMENT_ELEMENT_UPDATE_KEYS)
    ).toEqual({ readOnly: true });
  });

  it('drops Card Element create-only options', () => {
    expect(
      pickUpdateOptions({ disableLink: true, preferredNetwork: ['cartes_bancaires'], hidePostalCode: true }, CARD_ELEMENT_UPDATE_KEYS)
    ).toEqual({ hidePostalCode: true });
  });

  it('drops Card Number Element create-only options', () => {
    expect(
      pickUpdateOptions({ disableLink: true, preferredNetwork: ['visa'], placeholder: '4242' }, CARD_NUMBER_ELEMENT_UPDATE_KEYS)
    ).toEqual({ placeholder: '4242' });
  });

  it('keeps an explicit undefined so a caller can clear an updatable option', () => {
    expect(pickUpdateOptions({ readOnly: undefined }, PAYMENT_ELEMENT_UPDATE_KEYS)).toEqual({ readOnly: undefined });
    expect('readOnly' in pickUpdateOptions({ readOnly: undefined }, PAYMENT_ELEMENT_UPDATE_KEYS)).toBe(true);
  });

  it('accepts missing options', () => {
    expect(pickUpdateOptions(undefined, PAYMENT_ELEMENT_UPDATE_KEYS)).toEqual({});
  });

  it('warns only when a create-only value differs from the one used at creation', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const check = { element: 'Card Element', docsPath: 'card-elements', createdWith: { disableLink: true } };

    pickUpdateOptions({ disableLink: true, hidePostalCode: true }, CARD_ELEMENT_UPDATE_KEYS, check);
    expect(warn).not.toHaveBeenCalled();

    pickUpdateOptions({ disableLink: false }, CARD_ELEMENT_UPDATE_KEYS, check);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('disableLink can only be set when the Card Element is created');
    expect(warn.mock.calls[0][0]).toContain('https://ngx-stripe.dev/docs/card-elements');
  });
});
