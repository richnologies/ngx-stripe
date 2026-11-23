import { isDevMode } from '@angular/core';
import {
  StripeCardElementOptions,
  StripeCardElementUpdateOptions,
  StripeCardNumberElementOptions,
  StripeCardNumberElementUpdateOptions,
  StripePaymentElementOptions,
  StripePaymentElementUpdateOptions
} from '@stripe/stripe-js';

import { ngxStripeCreateOnlyOptionsChanged } from '../utils/setup-errors';

/**
 * The options Stripe.js accepts in `elements.create()` but not in `element.update()`, derived from
 * Stripe's own create and update types. Typed as a full record so the build fails when
 * `@stripe/stripe-js` changes that set, instead of drifting silently.
 */
export type CreateOnlyKeys<Create, Update> = { readonly [K in Exclude<keyof Create, keyof Update>]: true };

export const PAYMENT_ELEMENT_CREATE_ONLY_KEYS: CreateOnlyKeys<
  StripePaymentElementOptions,
  StripePaymentElementUpdateOptions
> = {
  wallets: true
};

type ObjectOf<T> = Exclude<NonNullable<T>, string>;
type PaymentLayoutCreateOnlyKey = Exclude<
  keyof ObjectOf<StripePaymentElementOptions['layout']>,
  keyof ObjectOf<StripePaymentElementUpdateOptions['layout']>
>;

/**
 * Keys inside an updatable option that can still only be set on create. Since stripe-js 10.3,
 * `layout.defaultCollapsed` and `layout.paymentMethodLogoPosition` cannot be updated.
 */
export const PAYMENT_ELEMENT_NESTED_CREATE_ONLY_KEYS: {
  readonly layout: { readonly [K in PaymentLayoutCreateOnlyKey]: true };
} = {
  layout: {
    defaultCollapsed: true,
    paymentMethodLogoPosition: true
  }
};

export const CARD_ELEMENT_CREATE_ONLY_KEYS: CreateOnlyKeys<StripeCardElementOptions, StripeCardElementUpdateOptions> = {
  disableLink: true,
  preferredNetwork: true
};

export const CARD_NUMBER_ELEMENT_CREATE_ONLY_KEYS: CreateOnlyKeys<
  StripeCardNumberElementOptions,
  StripeCardNumberElementUpdateOptions
> = {
  disableLink: true,
  preferredNetwork: true
};

/** What an element was created with, plus the create-only changes already warned about. */
export interface CreateOnlyCheck {
  element: string;
  docsPath: string;
  createdWith: object | null | undefined;
  warned: Record<string, unknown>;
}

export function createOnlyCheck(element: string, docsPath: string, createdWith?: object | null): CreateOnlyCheck {
  return { element, docsPath, createdWith, warned: {} };
}

/**
 * Stripe.js accepts fewer options in `element.update()` than in `elements.create()` (for example
 * `wallets` on the Payment Element) and warns about the rest (#333). Removes those create-only
 * options and passes everything else through, including options this version does not know about.
 *
 * `nested` removes create-only keys inside an updatable object option (for example `layout.defaultCollapsed`).
 *
 * In dev mode, warns once per new value when a create-only option differs from the one the element
 * was created with, because that change has no effect.
 */
export function omitCreateOnlyOptions<T>(
  options: object | null | undefined,
  createOnly: { readonly [key: string]: true },
  check?: CreateOnlyCheck,
  nested?: { readonly [key: string]: { readonly [key: string]: true } }
): Partial<T> {
  const kept: Record<string, unknown> = {};
  const changed: string[] = [];
  const source = (options || {}) as Record<string, unknown>;
  const createdWith = (check?.createdWith || {}) as Record<string, unknown>;

  for (const key of Object.keys(source)) {
    const value = source[key];

    if (has(createOnly, key)) {
      noteChange(check, changed, key, value, createdWith[key]);
      continue;
    }

    const nestedCreateOnly = nested?.[key];
    if (!nestedCreateOnly || !isPlainObject(value)) {
      kept[key] = value;
      continue;
    }

    const before = isPlainObject(createdWith[key]) ? createdWith[key] : {};
    const inner: Record<string, unknown> = {};
    for (const innerKey of Object.keys(value)) {
      if (has(nestedCreateOnly, innerKey)) {
        noteChange(check, changed, `${key}.${innerKey}`, value[innerKey], before[innerKey]);
      } else {
        inner[innerKey] = value[innerKey];
      }
    }
    kept[key] = inner;
  }

  if (check && changed.length && isDevMode()) {
    console.warn(ngxStripeCreateOnlyOptionsChanged(check.element, changed, check.docsPath));
  }

  return kept as Partial<T>;
}

/** Records a create-only option whose value is new: not the created one, and not already warned about. */
function noteChange(
  check: CreateOnlyCheck | undefined,
  changed: string[],
  path: string,
  value: unknown,
  created: unknown
): void {
  if (!check) {
    return;
  }
  if (deepEqual(value, created)) {
    delete check.warned[path];
    return;
  }
  if (has(check.warned, path) && deepEqual(check.warned[path], value)) {
    return;
  }
  check.warned[path] = value;
  changed.push(path);
}

function has(record: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, key);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Structural equality for option values. Key order does not matter; functions compare by reference. */
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, index) => deepEqual(item, b[index]));
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const keys = Object.keys(a);
    return keys.length === Object.keys(b).length && keys.every((key) => has(b, key) && deepEqual(a[key], b[key]));
  }
  return false;
}
