import { Component, inject } from '@angular/core';

import { StripeExpressCheckoutComponent, injectStripe } from 'ngx-stripe';
import { StripeElementsOptions, StripeExpressCheckoutElementOptions } from '@stripe/stripe-js';

import { NgStrPlutoService } from '../core';

@Component({
  selector: 'ngstr-express-checkout-element-example',
  template: `
    <div maxWidth="900">
      <div color="secondary" section-content-header>
        <span>Express Checkout Element</span>
      </div>
      <div section-content>
        <ngx-stripe-express-checkout
          [stripe]="stripe"
          [elementsOptions]="elementsOptions"
        />
        <button (click)="pay()">PAY</button>
      </div>
    </div>
  `,
  standalone: true,
  imports: [StripeExpressCheckoutComponent]
})
export default class ExpressCheckoutElementExampleComponent {
  private readonly plutoService = inject(NgStrPlutoService);

  stripe = injectStripe(this.plutoService.KEYS.main);
  elementsOptions: StripeElementsOptions = {
    mode: 'payment',
    amount: 1099,
    currency: 'usd',
    locale: 'es'
  };

  options: StripeExpressCheckoutElementOptions = {
    buttonType: {
      applePay: 'buy',
      googlePay: 'buy'
    }
  };

  paying = false;

  pay() {}
}
