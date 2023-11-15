import { Component, inject } from '@angular/core';
import { StripeElementsOptions } from '@stripe/stripe-js';

import { StripeElementsDirective, StripeP24BankComponent, injectStripe } from 'ngx-stripe';

import { NgStrPlutoService } from '../core';

@Component({
  selector: 'ngstr-p24-bank-example',
  template: `
    <div maxWidth="900">
      <div color="secondary" section-content-header>
        <span>P24 Bank</span>
      </div>
      <div section-content>
        <ngx-stripe-p24-bank [stripe]="stripe" />

        <div ngxStripeElements [stripe]="stripe" [elementsOptions]="elementsOptions">
          <ngx-stripe-p24-bank />
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [StripeElementsDirective, StripeP24BankComponent]
})
export default class P24BankExampleComponent {
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
