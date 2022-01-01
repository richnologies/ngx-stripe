import { Component, ViewChild, OnInit } from '@angular/core';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';

@Component({
  selector: 'app-test-01',
  template: `
    <div>
      <div color="secondary" section-content-header>
        <span>Card Example</span>
      </div>
      <div section-content>
        <p>Minimum example, just fill the form and get your token</p>
        <ngx-stripe-card [options]="cardOptions">
          <span style="color: green" *ngxStripeLoadingTemplate>
            Loading Stripe Card...
          </span>
        </ngx-stripe-card>
        <button (click)="buy()">CLICK</button>
      </div>
    </div>
  `,
  styles: []
})
export class Test01Component implements OnInit {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  cardOptions: StripeCardElementOptions = undefined;

  elementsOptions: StripeElementsOptions = {
    locale: 'es'
  };

  constructor(private stripeService: StripeService) {}

  ngOnInit() {
    setTimeout(() => this.updateStyle(), 5000);
  }

  buy() {
    this.stripeService
      .createToken(this.card.element, { name: 'Ricardo' })
      .subscribe((result) => {
        if (result.token) {
          console.log(result.token);
        } else if (result.error) {
          console.log(result.error.message);
        }
      });
  }

  updateStyle() {
    console.log('Update style');
    this.cardOptions = {
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
  }
}
