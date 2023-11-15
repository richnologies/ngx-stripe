import { Component, ViewChild, inject } from '@angular/core';

import { StripeIbanComponent, StripeElementsDirective, injectStripe } from 'ngx-stripe';
import { StripeElementsOptions, StripeIbanElementOptions, CreateTokenIbanData } from '@stripe/stripe-js';

import { NgStrPlutoService } from '../core';

@Component({
  selector: 'ngstr-iban-example',
  template: `
    <div>
      <div color="secondary" section-content-header>
        <span>Iban Example</span>
      </div>
      <div section-content>
        <p>Minimum example, just fill the form and get your token</p>
        <ngx-stripe-iban
          #ibanWithoutElements
          [stripe]="stripe"
          [options]="ibanOptions"
          [elementsOptions]="elementsOptions"
        />
        <button (click)="buy()">CLICK</button>

        <p>Another example where we use the new Elements Provider to create the IBAN, should work the same way</p>
        <div ngxStripeElements [stripe]="stripe" [elementsOptions]="elementsOptions">
          <ngx-stripe-iban #ibanWithElements [options]="ibanOptions" />
        </div>
        <button (click)="buyWithElements()">CLICK</button>
      </div>
    </div>
  `,
  standalone: true,
  imports: [StripeIbanComponent, StripeElementsDirective]
})
export default class IbanElementExampleComponent {
  @ViewChild('ibanWithoutElements') ibanWithoutElements: StripeIbanComponent;
  @ViewChild('ibanWithElements') ibanFromElements: StripeIbanComponent;

  private readonly plutoService = inject(NgStrPlutoService);

  ibanOptions: StripeIbanElementOptions = {
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
    },
    supportedCountries: ['SEPA']
  };

  stripe = injectStripe(this.plutoService.KEYS.main);
  elementsOptions: StripeElementsOptions = {
    locale: 'es'
  };

  buy() {
    this.stripe
      .createToken(this.ibanWithoutElements.element, {
        currency: 'eur',
        account_holder_name: 'Ricardo',
        account_holder_type: 'individual'
      } as CreateTokenIbanData)
      .subscribe((result) => {
        if (result.token) {
          console.log(result.token);
        } else if (result.error) {
          console.log(result.error.message);
        }
      });
  }

  buyWithElements() {
    this.stripe
      .createToken(this.ibanFromElements.element, {
        currency: 'eur',
        account_holder_name: 'Ricardo',
        account_holder_type: 'individual'
      } as CreateTokenIbanData)
      .subscribe((result) => {
        if (result.token) {
          console.log(result.token);
        } else if (result.error) {
          console.log(result.error.message);
        }
      });
  }
}
