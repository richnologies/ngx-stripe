import { Component, ViewChild } from '@angular/core';
import { StripePaymentRequestButtonComponent, StripeFactoryService } from 'ngx-stripe';
import { PaymentRequestOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { NgStrPlutoService } from '../core';

@Component({
  selector: 'ngstr-test-04',
  template: `
    <div maxWidth="900">
      <div color="secondary" section-content-header>
        <span>Payment Request Button Example</span>
      </div>
      <div section-content>
        <p>Minimum example, just fill the form and get your token</p>
        <ngx-stripe-payment-request-button
          [stripe]="stripe"
          [paymentOptions]="paymentRequestOptions"
          [elementsOptions]="elementsOptions"
          (paymentMethod)="onEvent('paymentMethod', $event)"
          (shippingaddresschange)="onEvent('onshippingaddresschange', $event)"
          (shippingoptionchange)="onEvent('onshippingoptionchange', $event)"
          (notavailable)="onEvent('notAvailable', $event)"
        ></ngx-stripe-payment-request-button>
        <button (click)="buy()">CLICK</button>
      </div>
    </div>
  `,
  styles: [],
  standalone: true,
  imports: [StripePaymentRequestButtonComponent]
})
export class PaymentRequestButtonExampleComponent {
  @ViewChild(StripePaymentRequestButtonComponent)
  button: StripePaymentRequestButtonComponent;

  stripe = this.stripeFactory.create(this.plutoService.KEYS.main);
  paymentRequestOptions: PaymentRequestOptions = {
    country: 'ES',
    currency: 'eur',
    total: { label: 'Demo total', amount: 1099 },
    requestPayerName: true,
    requestPayerEmail: true,
    requestShipping: true
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'es'
  };

  constructor(private stripeFactory: StripeFactoryService, private plutoService: NgStrPlutoService) {}

  buy() {}

  onEvent(eventType, ev) {
    if (eventType === 'onshippingaddresschange') {
      ev.updateWith({ status: 'success' });
    }
    console.log(eventType, ev);
  }
}
