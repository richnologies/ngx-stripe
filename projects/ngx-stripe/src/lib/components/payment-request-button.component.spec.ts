import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

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
  let mount: jasmine.Spy;
  let canMakePayment: jasmine.Spy;

  async function createFixture(canPay: { applePay?: boolean } | null, order: string[] = []) {
    mount = jasmine.createSpy('mount').and.callFake(() => order.push('mount'));
    canMakePayment = jasmine.createSpy('canMakePayment').and.callFake(() => {
      order.push('canMakePayment');
      return Promise.resolve(canPay);
    });

    const paymentRequest = {
      canMakePayment,
      on: jasmine.createSpy('on'),
      update: jasmine.createSpy('update'),
      show: jasmine.createSpy('show'),
      abort: jasmine.createSpy('abort'),
      isShowing: () => false
    };
    const element = {
      mount,
      unmount: jasmine.createSpy('unmount'),
      destroy: jasmine.createSpy('destroy'),
      on: jasmine.createSpy('on'),
      update: jasmine.createSpy('update')
    };
    const create = jasmine.createSpy('create').and.returnValue(element);

    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        {
          provide: StripeElementsService,
          useValue: {
            elements: jasmine.createSpy('elements').and.returnValue(of({ create })),
            paymentRequest: jasmine.createSpy('paymentRequest').and.returnValue(paymentRequest),
            mergeOptions: jasmine.createSpy('mergeOptions').and.callFake((options) => options || {})
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
    expect(fixture.componentInstance.loaded).toBeTrue();
  });

  it('emits notavailable when canMakePayment is falsy', async () => {
    const fixture = await createFixture(null);

    expect(fixture.componentInstance.missing).toBeTrue();
    expect(mount).not.toHaveBeenCalled();
  });
});
