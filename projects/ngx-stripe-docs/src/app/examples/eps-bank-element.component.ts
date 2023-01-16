import { Component } from '@angular/core';
import { StripeElementsOptions } from '@stripe/stripe-js';

import { NgxStripeModule, StripeFactoryService } from 'ngx-stripe';

import { NgStrPlutoService } from '../core';

@Component({
  selector: 'ngstr-eps-bank-example',
  template: `
    <div maxWidth="900">
      <div color="secondary" section-content-header>
        <span>EPS Bank</span>
      </div>
      <div section-content>
        <ngx-stripe-eps-bank [stripe]="stripe"></ngx-stripe-eps-bank>

        <div ngxStripeElements [stripe]="stripe" [elementsOptions]="elementsOptions">
          <ngx-stripe-eps-bank></ngx-stripe-eps-bank>
        </div>
      </div>
    </div>
  `,
  styles: [],
  standalone: true,
  imports: [NgxStripeModule]
})
export class EpsBankExampleComponent {
  stripe = this.stripeFactory.create(this.plutoService.KEYS.main);
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

  constructor(
    private plutoService: NgStrPlutoService,
    private stripeFactory: StripeFactoryService
  ) {}
}
