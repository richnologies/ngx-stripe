import { Component, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import type { Mock } from 'vitest';

import { StripePaymentRequestButtonComponent } from './payment-request-button.component';
import { StripeElementsService } from '../services/stripe-elements.service';

@Component({
  standalone: true,
  imports: [StripePaymentRequestButtonComponent],
  template: `
    <ngx-stripe-payment-request-button
      [paymentOptions]="paymentOptions"
      [stripe]="stripe"
      (notavailable)="missing = true"
      (load)="loaded = true"
    />
  `
})
class HostComponent {
  missing = false;
  loaded = false;
  stripe = {} as any;
  paymentOptions = {
    country: 'US',
    currency: 'usd',
    total: { label: 'Demo', amount: 1000 }
  };
}

@Component({
  standalone: true,
  imports: [StripePaymentRequestButtonComponent],
  template: `
    <ngx-stripe-payment-request-button
      [paymentOptions]="paymentOptions"
      [stripe]="stripe"
      (paymentMethod)="onPaymentMethod($event)"
      (load)="loaded = true"
    />
  `
})
class PaymentMethodHostComponent {
  loaded = false;
  lastEvent: unknown;
  stripe = {} as any;
  paymentOptions = {
    country: 'US',
    currency: 'usd',
    total: { label: 'Demo', amount: 1000 }
  };

  onPaymentMethod(ev: unknown) {
    this.lastEvent = ev;
  }
}

describe('StripePaymentRequestButtonComponent', () => {
  let mount: Mock;
  let canMakePayment: Mock;
  let paymentRequests: Array<{ on: Mock; canMakePayment: Mock }>;

  async function createFixture<T>(Host: Type<T>, canPay: { applePay?: boolean } | null, order: string[] = []) {
    paymentRequests = [];
    mount = vi.fn().mockImplementation(() => order.push('mount'));
    canMakePayment = vi.fn().mockImplementation(() => {
      order.push('canMakePayment');
      return Promise.resolve(canPay);
    });

    const create = vi.fn().mockImplementation(() => ({
      mount,
      unmount: vi.fn(),
      destroy: vi.fn(),
      on: vi.fn(),
      update: vi.fn()
    }));

    TestBed.configureTestingModule({
      imports: [Host],
      providers: [
        {
          provide: StripeElementsService,
          useValue: {
            elements: vi.fn().mockReturnValue(of({ create })),
            paymentRequest: vi.fn().mockImplementation(() => {
              const paymentRequest = {
                canMakePayment,
                on: vi.fn(),
                update: vi.fn(),
                show: vi.fn(),
                abort: vi.fn(),
                isShowing: () => false
              };
              paymentRequests.push(paymentRequest);
              return paymentRequest;
            }),
            mergeOptions: vi.fn().mockImplementation((options) => options || {})
          }
        }
      ]
    });

    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    await Promise.resolve();
    await fixture.whenStable();
    return fixture;
  }

  function registeredEvents(paymentRequest: { on: Mock }): string[] {
    return paymentRequest.on.mock.calls.map((call) => String(call[0]));
  }

  it('awaits canMakePayment before mounting the Element', async () => {
    const order: string[] = [];
    const fixture = await createFixture(HostComponent, { applePay: true }, order);

    expect(canMakePayment).toHaveBeenCalled();
    expect(mount).toHaveBeenCalled();
    expect(order.indexOf('canMakePayment')).toBeGreaterThanOrEqual(0);
    expect(order.indexOf('mount')).toBeGreaterThan(order.indexOf('canMakePayment'));
    expect(fixture.componentInstance.loaded).toBe(true);
  });

  it('emits notavailable when canMakePayment is falsy', async () => {
    const fixture = await createFixture(HostComponent, null);

    expect(fixture.componentInstance.missing).toBe(true);
    expect(mount).not.toHaveBeenCalled();
  });

  it('registers only paymentmethod when (paymentMethod) is bound', async () => {
    await createFixture(PaymentMethodHostComponent, { applePay: true });

    expect(paymentRequests.length).toBeGreaterThan(0);
    const latest = paymentRequests[paymentRequests.length - 1];
    const events = registeredEvents(latest);

    expect(events).toContain('paymentmethod');
    expect(events).not.toContain('token');
    expect(events).not.toContain('source');
  });
});
