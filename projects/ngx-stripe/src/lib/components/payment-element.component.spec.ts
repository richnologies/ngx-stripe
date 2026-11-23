import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';

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

describe('StripePaymentElementComponent (fieldchange) beta event', () => {
  const fieldChangeListeners = (paymentElement: { on: { mock: { calls: unknown[][] } } }) =>
    paymentElement.on.mock.calls.filter((call) => call[0] === 'fieldchange');

  it('does not listen to fieldchange unless something subscribes', async () => {
    const { cmp, paymentElement } = harness();

    await cmp.ngOnInit();

    const events = paymentElement.on.mock.calls.map((call: unknown[]) => call[0]);
    expect(events).toContain('change');
    expect(events).not.toContain('fieldchange');
  });

  it('listens and forwards fieldchange events when subscribed before the element exists', async () => {
    const { cmp, paymentElement } = harness();
    const received: unknown[] = [];
    cmp.fieldchange.subscribe((ev) => received.push(ev));

    await cmp.ngOnInit();

    const calls = fieldChangeListeners(paymentElement);
    expect(calls).toHaveLength(1);
    const event = { elementType: 'payment', fieldId: 'number', type: 'focused' };
    (calls[0][1] as (ev: unknown) => void)(event);
    expect(received).toEqual([event]);
  });

  it('starts listening when code subscribes after the element was created', async () => {
    const { cmp, paymentElement } = harness();
    await cmp.ngOnInit();
    expect(fieldChangeListeners(paymentElement)).toHaveLength(0);

    const received: unknown[] = [];
    cmp.fieldchange.subscribe((ev) => received.push(ev));
    cmp.fieldchange.subscribe(() => undefined);

    const calls = fieldChangeListeners(paymentElement);
    expect(calls).toHaveLength(1);
    (calls[0][1] as (ev: unknown) => void)({ fieldId: 'expiry' });
    expect(received).toEqual([{ fieldId: 'expiry' }]);
  });

  it('does not depend on Subject.observed, which RxJS 6 does not have', async () => {
    const { cmp, paymentElement } = harness();
    Object.defineProperty(cmp.fieldchange, 'observed', { get: () => undefined });
    cmp.fieldchange.subscribe(() => undefined);

    await cmp.ngOnInit();

    expect(fieldChangeListeners(paymentElement)).toHaveLength(1);
  });

  it('listens again on a re-created element', async () => {
    const { cmp, stripeElements } = harness();
    const first = { on: vi.fn(), mount: vi.fn(), destroy: vi.fn(), update: vi.fn(), collapse: vi.fn() };
    const second = { on: vi.fn(), mount: vi.fn(), destroy: vi.fn(), update: vi.fn(), collapse: vi.fn() };
    stripeElements.create.mockReturnValueOnce(first).mockReturnValueOnce(second);
    cmp.fieldchange.subscribe(() => undefined);

    await cmp.ngOnInit();
    cmp.clientSecret = 'pi_secret_next';
    await cmp.ngOnChanges({ clientSecret: change('pi_secret_next') });

    expect(fieldChangeListeners(first)).toHaveLength(1);
    expect(fieldChangeListeners(second)).toHaveLength(1);
  });

  it('listens when (fieldchange) is bound in a template', async () => {
    const paymentElement = { on: vi.fn(), mount: vi.fn(), destroy: vi.fn(), update: vi.fn(), collapse: vi.fn() };
    const elementsService = {
      elements: () => of({ create: () => paymentElement }),
      mergeOptions: (options?: unknown) => options || {}
    };

    @Component({
      standalone: true,
      imports: [StripePaymentElementComponent],
      template: `<ngx-stripe-payment [stripe]="stripe" (fieldchange)="events.push($event)" />`
    })
    class HostComponent {
      stripe = {} as StripePaymentElementComponent['stripe'];
      events: unknown[] = [];
    }

    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [{ provide: StripeElementsService, useValue: elementsService }]
    });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const calls = fieldChangeListeners(paymentElement);
    expect(calls).toHaveLength(1);
    (calls[0][1] as (ev: unknown) => void)({ fieldId: 'cvc' });
    expect(fixture.componentInstance.events).toEqual([{ fieldId: 'cvc' }]);
  });
});

describe('StripePaymentElementComponent options updates (#333)', () => {
  afterEach(() => vi.restoreAllMocks());

  async function created(options: Record<string, unknown>) {
    const h = harness();
    h.cmp.options = options;
    await h.cmp.ngOnInit();
    return h;
  }

  it('creates the element with create-only options such as wallets', async () => {
    const { stripeElements } = await created({ wallets: { applePay: 'never' }, readOnly: false });

    expect(stripeElements.create).toHaveBeenCalledWith('payment', { wallets: { applePay: 'never' }, readOnly: false });
  });

  it('sends only updatable options to element.update() when [options] changes', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { cmp, paymentElement, stripeElements } = await created({
      wallets: { applePay: 'never' },
      readOnly: false
    });

    // A signal or getter usually builds a new object with the same wallets value.
    cmp.options = {
      wallets: { applePay: 'never' },
      readOnly: true,
      defaultValues: { billingDetails: { name: 'Jenny Rosen' } }
    };
    await cmp.ngOnChanges({ options: change(cmp.options) });

    expect(stripeElements.create).toHaveBeenCalledTimes(1);
    expect(paymentElement.update).toHaveBeenCalledWith({
      readOnly: true,
      defaultValues: { billingDetails: { name: 'Jenny Rosen' } }
    });
    expect(warn).not.toHaveBeenCalled();
  });

  it('filters the public update() method too', async () => {
    const { cmp, paymentElement } = await created({});
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    cmp.update({ wallets: { googlePay: 'never' }, layout: 'tabs' });

    expect(paymentElement.update).toHaveBeenCalledWith({ layout: 'tabs' });
  });

  it('warns in dev mode when a create-only option gets a new value, since it has no effect', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { cmp, paymentElement } = await created({ wallets: { applePay: 'never' } });

    cmp.options = { wallets: { applePay: 'auto' }, readOnly: true };
    await cmp.ngOnChanges({ options: change(cmp.options) });

    expect(paymentElement.update).toHaveBeenCalledWith({ readOnly: true });
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('[ngx-stripe] wallets can only be set when the Payment Element is created');
  });
});
