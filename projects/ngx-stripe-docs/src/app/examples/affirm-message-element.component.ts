import { Component } from '@angular/core';

import { NgxStripeModule, StripeFactoryService } from 'ngx-stripe';
import { StripeAffirmMessageElementOptions, StripeElementsOptions } from '@stripe/stripe-js';

import { NgStrPlutoService } from '../core';

@Component({
  selector: 'ngstr-affirm-message-example',
  template: `
    <div>
      <div color="secondary" section-content-header>
        <span>Affirm Message</span>
      </div>
      <div section-content>
        <div ngxStripeElements [stripe]="stripe" [elementsOptions]="elementsOptions">
          <ngx-stripe-affirm-message [options]="affirmOptions">
            <span class="text-green-400" *ngxStripeLoadingTemplate> Loading Affirm Message... </span>
          </ngx-stripe-affirm-message>
        </div>
      </div>
    </div>
  `,
  styles: [],
  standalone: true,
  imports: [NgxStripeModule]
})
export class AffirmMessageExampleComponent {
  stripe = this.stripeFactory.create(this.plutoService.KEYS.main);
  affirmOptions: StripeAffirmMessageElementOptions = {
    amount: 5000,
    currency: 'USD'
  };
  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  constructor(private stripeFactory: StripeFactoryService, private plutoService: NgStrPlutoService) {}
}
