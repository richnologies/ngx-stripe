import { Component, ViewChild } from '@angular/core';
import { StripePaymentRequestButtonComponent, NgxStripeModule, StripeFactoryService } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
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
          [options]="paymentRequestButtonOptions"
          [paymentOptions]="paymentRequestOptions"
          [elementsOptions]="elementsOptions"
        ></ngx-stripe-payment-request-button>
        <button (click)="buy()">CLICK</button>
      </div>
    </div>
  `,
  styles: [],
  standalone: true,
  imports: [NgxStripeModule]
})
export class PaymentRequestButtonExampleComponent {
  @ViewChild(StripePaymentRequestButtonComponent)
  button: StripePaymentRequestButtonComponent;

  stripe = this.stripeFactory.create(this.plutoService.KEYS.main);
  paymentRequestOptions = {
    country: 'ES',
    currency: 'eur',
    total: { label: 'Demo total', amount: 1099 },
    requestPayerName: true,
    requestPayerEmail: true
  };

  paymentRequestButtonOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'es'
  };

  constructor(private stripeFactory: StripeFactoryService, private plutoService: NgStrPlutoService) {}

  buy() {}
}
