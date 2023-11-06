import { Component } from '@angular/core';

import { StripeAfterpayClearpayMessageComponent, StripeElementsDirective, StripeFactoryService } from 'ngx-stripe';
import { StripeAfterpayClearpayMessageElementOptions, StripeElementsOptions } from '@stripe/stripe-js';

import { NgStrPlutoService } from '../core';

@Component({
  selector: 'ngstr-affirm-message-example',
  template: `
    <div>
      <div color="secondary" section-content-header>
        <span>Afterpay Clearpay Message</span>
      </div>
      <div section-content>
        <div ngxStripeElements [stripe]="stripe" [elementsOptions]="elementsOptions">
          <ngx-stripe-afterpay-clearpay-message [options]="afterpayClearpayOptions">
            <span class="text-green-400" *ngxStripeLoadingTemplate> Loading Affirm Message... </span>
          </ngx-stripe-afterpay-clearpay-message>
        </div>
      </div>
    </div>
  `,
  styles: [],
  standalone: true,
  imports: [StripeAfterpayClearpayMessageComponent, StripeElementsDirective]
})
export class AfterpayClearpayMessageExampleComponent {
  stripe = this.stripeFactory.create(this.plutoService.KEYS.main);
  afterpayClearpayOptions: StripeAfterpayClearpayMessageElementOptions = {
    amount: 5000,
    currency: 'USD',
    logoType: 'lockup'
  };
  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  constructor(private stripeFactory: StripeFactoryService, private plutoService: NgStrPlutoService) {}
}
