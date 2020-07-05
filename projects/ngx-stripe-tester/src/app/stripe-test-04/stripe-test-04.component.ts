import { Component, ViewChild } from '@angular/core';
import { StripeService, StripePaymentRequestButtonComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';

@Component({
  selector: 'app-test-04',
  template: `
    <app-section maxWidth="900">
      <mat-toolbar color="secondary" section-content-header>
        <span>Payment Request Button Example</span>
      </mat-toolbar>
      <div section-content>
        <p>Minimum example, just fill the form and get your token</p>
        <ngx-stripe-payment-request-button
          [options]="paymentRequestButtonOptions"
          [paymentOptions]="paymentRequestOptions"
          [elementsOptions]="elementsOptions"
        ></ngx-stripe-payment-request-button>
        <button (click)="buy()">CLICK</button>
      </div>
    </app-section>
  `,
  styles: []
})
export class Test04Component {
  @ViewChild(StripePaymentRequestButtonComponent) button: StripePaymentRequestButtonComponent;
  paymentRequestOptions = {
    country: 'ES',
    currency: 'eur',
    total: { label: 'Demo total', amount: 1099 },
    requestPayerName: true,
    requestPayerEmail: true,
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

  constructor(private stripeService: StripeService) {}

  buy() {

  }
}
