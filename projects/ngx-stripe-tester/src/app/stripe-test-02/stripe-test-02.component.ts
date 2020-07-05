import { Component, ViewChild } from '@angular/core';
import { StripeService, StripeIbanComponent } from 'ngx-stripe';
import {
  StripeElementsOptions,
  StripeIbanElementOptions,
  CreateTokenIbanData
} from '@stripe/stripe-js';

@Component({
  selector: 'app-test-02',
  template: `
    <app-section maxWidth="900">
      <mat-toolbar color="secondary" section-content-header>
        <span>Iban Example</span>
      </mat-toolbar>
      <div section-content>
        <p>Minimum example, just fill the form and get your token</p>
        <ngx-stripe-iban
          [options]="ibanOptions"
          [elementsOptions]="elementsOptions"
        ></ngx-stripe-iban>
        <button (click)="buy()">CLICK</button>
      </div>
    </app-section>
  `,
  styles: []
})
export class Test02Component {
  @ViewChild(StripeIbanComponent) iban: StripeIbanComponent;

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
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'es'
  };

  constructor(private stripeService: StripeService) {}

  buy() {
    this.stripeService
      .createToken(this.iban.element, {
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
