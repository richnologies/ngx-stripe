import { Component, inject } from '@angular/core';
import { StripeElementsOptions } from '@stripe/stripe-js';

import { StripeElementsDirective, StripeEpsBankComponent, injectStripe } from 'ngx-stripe';

import { NgStrPlutoService } from '../core';

@Component({
  selector: 'ngstr-eps-bank-example',
  template: `
    <div maxWidth="900">
      <div color="secondary" section-content-header>
        <span>EPS Bank</span>
      </div>
      <div section-content>
        <ngx-stripe-eps-bank [stripe]="stripe" />

        <div ngxStripeElements [stripe]="stripe" [elementsOptions]="elementsOptions">
          <ngx-stripe-eps-bank />
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [StripeEpsBankComponent, StripeElementsDirective]
})
export default class EpsBankExampleComponent {
  private readonly plutoService = inject(NgStrPlutoService);

  stripe = injectStripe(this.plutoService.KEYS.main);
  elementsOptions: StripeElementsOptions = {
    locale: 'es'
  };
  elementOptions = {
    style: {
      base: {
        padding: '10px 12px',
        color: '#32325d',
        fontSize: '16px'
      }
    }
  };

  paying = false;
  clientSecret: string;
}
