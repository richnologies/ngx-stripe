import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';

import { StripePaymentElementComponent } from './payment-element.component';
import { StripeElementsService } from '../services/stripe-elements.service';

function change(currentValue: unknown) {
  return {
    previousValue: undefined,
    currentValue,
    firstChange: true,
    isFirstChange: () => true
  };
}

function harness() {
  const paymentElement = {
    on: vi.fn(),
    mount: vi.fn(),
    destroy: vi.fn(),
    update: vi.fn(),
    collapse: vi.fn()
  };
  const stripeElements = {
    create: vi.fn(() => paymentElement)
  };
  const elementsFn = vi.fn((_stripe?: unknown, _options?: unknown) => of(stripeElements));
  const stripeElementsService = {
    elements: elementsFn,
    mergeOptions: (options?: unknown) => options || {}
  };

  const cmp = new StripePaymentElementComponent(
    stripeElementsService as unknown as StripeElementsService,
    null as never
  );
  cmp.stripeElementRef = { nativeElement: document.createElement('div') };
  cmp.stripe = {} as StripePaymentElementComponent['stripe'];

  return { cmp, elementsFn, stripeElements, paymentElement };
}

describe('StripePaymentElementComponent doNotCreateUntilClientSecretIsSet', () => {
  it('does not call stripe.elements() when the flag is true and no secret is set', async () => {
    const { cmp, elementsFn, stripeElements } = harness();
    cmp.doNotCreateUntilClientSecretIsSet = true;

    await cmp.ngOnInit();
    await cmp.ngOnChanges({});

    expect(elementsFn).not.toHaveBeenCalled();
    expect(stripeElements.create).not.toHaveBeenCalled();
    expect(cmp.element).toBeUndefined();
    expect(cmp.state).toBe('notready');
  });

  it('mounts after [clientSecret] is set asynchronously', async () => {
    const { cmp, elementsFn, stripeElements, paymentElement } = harness();
    cmp.doNotCreateUntilClientSecretIsSet = true;

    await cmp.ngOnInit();
    expect(elementsFn).not.toHaveBeenCalled();

    cmp.clientSecret = 'pi_secret_async';
    await cmp.ngOnChanges({ clientSecret: change('pi_secret_async') });

    expect(elementsFn).toHaveBeenCalledTimes(1);
    expect(elementsFn.mock.calls[0][1]).toMatchObject({ clientSecret: 'pi_secret_async' });
    expect(stripeElements.create).toHaveBeenCalledWith('payment', {});
    expect(paymentElement.mount).toHaveBeenCalledTimes(1);
    expect(cmp.state).toBe('ready');
  });

  it('mounts after elementsOptions.clientSecret is set (no [clientSecret] input)', async () => {
    const { cmp, elementsFn, stripeElements, paymentElement } = harness();
    cmp.doNotCreateUntilClientSecretIsSet = true;

    await cmp.ngOnInit();
    expect(stripeElements.create).not.toHaveBeenCalled();

    cmp.elementsOptions = { clientSecret: 'pi_secret_options' };
    await cmp.ngOnChanges({ elementsOptions: change(cmp.elementsOptions) });

    expect(elementsFn).toHaveBeenCalledTimes(1);
    expect(elementsFn.mock.calls[0][1]).toMatchObject({ clientSecret: 'pi_secret_options' });
    expect(stripeElements.create).toHaveBeenCalledWith('payment', {});
    expect(paymentElement.mount).toHaveBeenCalledTimes(1);
    expect(cmp.state).toBe('ready');
  });

  it('keeps eager creation when the flag is false (default)', async () => {
    const { cmp, elementsFn, stripeElements, paymentElement } = harness();

    await cmp.ngOnInit();

    expect(elementsFn).toHaveBeenCalledTimes(1);
    expect(stripeElements.create).toHaveBeenCalledWith('payment', {});
    expect(paymentElement.mount).toHaveBeenCalledTimes(1);
    expect(cmp.state).toBe('ready');
  });
});
