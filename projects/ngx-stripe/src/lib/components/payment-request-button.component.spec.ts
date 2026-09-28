import { Component } from '@angular/core';
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

describe('StripePaymentRequestButtonComponent', () => {
  let mount: Mock;
  let canMakePayment: Mock;

  async function createFixture(canPay: { applePay?: boolean } | null, order: string[] = []) {
    mount = vi.fn().mockImplementation(() => order.push('mount'));
    canMakePayment = vi.fn().mockImplementation(() => {
      order.push('canMakePayment');
      return Promise.resolve(canPay);
    });

    const paymentRequest = {
      canMakePayment,
      on: vi.fn(),
      update: vi.fn(),
      show: vi.fn(),
      abort: vi.fn(),
      isShowing: () => false
    };
    const element = {
      mount,
      unmount: vi.fn(),
      destroy: vi.fn(),
      on: vi.fn(),
      update: vi.fn()
    };
    const create = vi.fn().mockReturnValue(element);

    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        {
          provide: StripeElementsService,
          useValue: {
            elements: vi.fn().mockReturnValue(of({ create })),
            paymentRequest: vi.fn().mockReturnValue(paymentRequest),
            mergeOptions: vi.fn().mockImplementation((options) => options || {})
          }
        }
      ]
    });

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    await Promise.resolve();
    await fixture.whenStable();
    return fixture;
  }

  it('awaits canMakePayment before mounting the Element', async () => {
    const order: string[] = [];
    const fixture = await createFixture({ applePay: true }, order);

    expect(canMakePayment).toHaveBeenCalled();
    expect(mount).toHaveBeenCalled();
    expect(order.indexOf('canMakePayment')).toBeGreaterThanOrEqual(0);
    expect(order.indexOf('mount')).toBeGreaterThan(order.indexOf('canMakePayment'));
    expect(fixture.componentInstance.loaded).toBe(true);
  });

  it('emits notavailable when canMakePayment is falsy', async () => {
    const fixture = await createFixture(null);

    expect(fixture.componentInstance.missing).toBe(true);
    expect(mount).not.toHaveBeenCalled();
  });
});
