import { isDevMode } from '@angular/core';
import {
  StripeCardElementUpdateOptions,
  StripeCardNumberElementUpdateOptions,
  StripePaymentElementUpdateOptions
} from '@stripe/stripe-js';

import { ngxStripeCreateOnlyOptionsChanged } from '../utils/setup-errors';

/**
 * Every key of a Stripe.js `*UpdateOptions` type. Typed as a full record so the build fails
 * when `@stripe/stripe-js` adds or removes an updatable option, instead of drifting silently.
 */
export type UpdateOptionKeys<T> = { readonly [K in keyof Required<T>]: true };

export const PAYMENT_ELEMENT_UPDATE_KEYS: UpdateOptionKeys<StripePaymentElementUpdateOptions> = {
  defaultValues: true,
  business: true,
  paymentMethodOrder: true,
  fields: true,
  readOnly: true,
  terms: true,
  layout: true,
  applePay: true,
  walletOptions: true
};

export const CARD_ELEMENT_UPDATE_KEYS: UpdateOptionKeys<StripeCardElementUpdateOptions> = {
  classes: true,
  style: true,
  value: true,
  hidePostalCode: true,
  iconStyle: true,
  hideIcon: true,
  disabled: true
};

export const CARD_NUMBER_ELEMENT_UPDATE_KEYS: UpdateOptionKeys<StripeCardNumberElementUpdateOptions> = {
  classes: true,
  style: true,
  placeholder: true,
  disabled: true,
  showIcon: true,
  iconStyle: true
};

/**
 * Stripe.js accepts fewer options in `element.update()` than in `elements.create()` (for example
 * `wallets` on the Payment Element) and warns about the rest (#333). Keeps only the updatable keys.
 *
 * In dev mode, warns when a create-only option now has a different value than the one the element
 * was created with, because that change has no effect.
 */
export function pickUpdateOptions<T>(
  options: object | null | undefined,
  keys: UpdateOptionKeys<T>,
  check?: { element: string; docsPath: string; createdWith: object | null | undefined }
): Partial<T> {
  const picked: Record<string, unknown> = {};
  const changed: string[] = [];
  const source = (options || {}) as Record<string, unknown>;
  const createdWith = (check?.createdWith || {}) as Record<string, unknown>;

  for (const key of Object.keys(source)) {
    if (Object.prototype.hasOwnProperty.call(keys, key)) {
      picked[key] = source[key];
    } else if (check && !sameValue(source[key], createdWith[key])) {
      changed.push(key);
    }
  }

  if (check && changed.length && isDevMode()) {
    console.warn(ngxStripeCreateOnlyOptionsChanged(check.element, changed, check.docsPath));
  }

  return picked as Partial<T>;
}

function sameValue(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return true;
  }
}
