import { Component, ViewChild } from '@angular/core';
import {
  StripeService,
  Elements,
  Element as StripeElement,
  ElementOptions,
  ElementsOptions,
  StripeCardComponent
} from 'ngx-stripe';

@Component({
  selector: 'app-test-01',
  templateUrl: './stripe-test-01.component.html',
  styles: []
})
export class Test01Component {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  elements: Elements;

  cardOptions: ElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: 300,
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: ElementsOptions = {
    locale: 'es'
  };

  constructor(private stripeService: StripeService) {}

  buy() {
    this.stripeService
      .createToken(this.card.getCard(), { name: 'Ricardo' })
      .subscribe((result) => {
        if (result.token) {
          console.log(result.token);
        } else if (result.error) {
          console.log(result.error.message);
        }
      });
  }
}
