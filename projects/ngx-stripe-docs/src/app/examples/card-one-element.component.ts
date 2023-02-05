import { Component, ViewChild } from '@angular/core';

import { StripeCardComponent, StripeFactoryService, StripeElementsDirective } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';

import { NgStrPlutoService } from '../core';

@Component({
  selector: 'ngstr-card-one-element-example',
  template: `
    <div>
      <div color="secondary" section-content-header>
        <span>One Card Example</span>
      </div>
      <div section-content>
        <p>Minimum example, just fill the form and get your token</p>
        <ngx-stripe-card #cardWithoutElements [stripe]="stripe" [options]="cardOptions">
          <span class="text-green-400" *ngxStripeLoadingTemplate> Loading Stripe Card... </span>
        </ngx-stripe-card>
        <button (click)="buy()">CLICK</button>

        <p>Another example where we use the new Elements Provider to create the Card, should work the same way</p>
        <div ngxStripeElements [stripe]="stripe" [elementsOptions]="elementsOptions">
          <ngx-stripe-card #cardWithElements [options]="cardOptions">
            <span class="text-green-400" *ngxStripeLoadingTemplate> Loading Stripe Card... </span>
          </ngx-stripe-card>
        </div>
        <button (click)="buyWithElements()">CLICK</button>
      </div>
    </div>
  `,
  styles: [],
  standalone: true,
  imports: [StripeCardComponent, StripeElementsDirective]
})
export class CardOneElementExampleComponent {
  @ViewChild('cardWithoutElements') cardWithoutElements: StripeCardComponent;
  @ViewChild('cardWithElements') cardFromElements: StripeCardComponent;

  stripe = this.stripeFactory.create(this.plutoService.KEYS.main);
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

  constructor(private stripeFactory: StripeFactoryService, private plutoService: NgStrPlutoService) {}

  buy() {
    this.stripe.createToken(this.cardWithoutElements.element, { name: 'Ricardo' }).subscribe((result) => {
      if (result.token) {
        console.log(result.token);
      } else if (result.error) {
        console.log(result.error.message);
      }
    });
  }

  buyWithElements() {
    this.stripe.createToken(this.cardFromElements.element, { name: 'Ricardo' }).subscribe((result) => {
      if (result.token) {
        console.log(result.token);
      } else if (result.error) {
        console.log(result.error.message);
      }
    });
  }
}
