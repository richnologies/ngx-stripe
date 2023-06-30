import { Component } from '@angular/core';

import { StripeElementsDirective, StripeFactoryService, StripePaymentMethodMessagingComponent } from 'ngx-stripe';
import { StripeElementsOptions, StripePaymentMethodMessagingElementOptions } from '@stripe/stripe-js';

import { NgStrPlutoService } from '../core';

@Component({
  selector: 'ngstr-payment-method-messaging-example',
  template: `
    <div>
      <div color="secondary" section-content-header>
        <span>Payment Method Messaging</span>
      </div>
      <div section-content>
        <div ngxStripeElements [stripe]="stripe" [elementsOptions]="elementsOptions">
          <ngx-stripe-payment-method-messaging [options]="options">
            <span class="text-green-400" *ngxStripeLoadingTemplate> Loading Payment Method Messaging... </span>
          </ngx-stripe-payment-method-messaging>
        </div>
      </div>
    </div>
  `,
  styles: [],
  standalone: true,
  imports: [StripePaymentMethodMessagingComponent, StripeElementsDirective]
})
export class PaymentMethodMessagingExampleComponent {
  stripe = this.stripeFactory.create(this.plutoService.KEYS.main);
  options: StripePaymentMethodMessagingElementOptions = {
    amount: 9900, // $99.00 USD
    currency: 'USD',
    paymentMethodTypes: ['klarna', 'afterpay_clearpay', 'affirm'],
    // the country that the end-buyer is in
    countryCode: 'US'
  };
  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  constructor(private stripeFactory: StripeFactoryService, private plutoService: NgStrPlutoService) {}
}
