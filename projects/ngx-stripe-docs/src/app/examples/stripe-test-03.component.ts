import { Component, ViewChild } from '@angular/core';
import { StripeService, StripeCardComponent, NgxStripeModule } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';

@Component({
  selector: 'ngstr-test-03',
  template: `
    <div>
      <div color="secondary" section-content-header>
        <span>Card Example</span>
      </div>
      <div section-content>
        <p>Minimum example, just fill the form and get your token</p>
        <ngx-stripe-card [options]="cardOptions" [elementsOptions]="elementsOptions"></ngx-stripe-card>
        <button (click)="buy()">CLICK</button>
      </div>
    </div>
  `,
  styles: [],
  standalone: true,
  imports: [NgxStripeModule]
})
export class Test03Component {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  cardOptions: StripeCardElementOptions = {
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
    this.stripeService.createToken(this.card.getCard(), { name: 'Ricardo' }).subscribe((result) => {
      if (result.token) {
        console.log(result.token);
      } else if (result.error) {
        console.log(result.error.message);
      }
    });
  }
}
