import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import {
  StripeFactoryService,
  StripeExpressCheckoutComponent
} from 'ngx-stripe';
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

        ></ngx-stripe-express-checkout>
        <button (click)="pay()">PAY</button>
      </div>
    </div>
  `,
  styles: [],
  standalone: true,
  imports: [
    CommonModule,
    StripeExpressCheckoutComponent
  ]
})
export class ExpressCheckoutElementExampleComponent {
  stripe = this.stripeFactory.create(this.plutoService.KEYS.main);
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

  constructor(
    private plutoService: NgStrPlutoService,
    private stripeFactory: StripeFactoryService
  ) {}

  pay() {
    
  }
}
