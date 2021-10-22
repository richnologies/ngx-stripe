import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

import { StripeService, StripeCardComponent, StripeFactoryService } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';

import { PlutoService } from '../core';

@Component({
  selector: 'app-test-05',
  template: `
    <app-section maxWidth="900">
      <mat-toolbar color="secondary" section-content-header>
        <span>Card Payment Intent Example</span>
      </mat-toolbar>
      <div section-content [formGroup]="stripeTest">
        <input placeholder="name" formControlName="name" />
        <input placeholder="amount" type="number" formControlName="amount" />
        <ngx-stripe-card [options]="cardOptions">
          <span style="color: green" *ngxStripeLoadingTemplate>
            Loading Stripe Card...
          </span>
        </ngx-stripe-card>
        <button (click)="pay()">PAY</button>
      </div>
    </app-section>
  `,
  styles: []
})
export class Test05Component {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  stripe = this.factory.create(
    'pk_test_51IvkafL0RbPb0ITBwzybjdb6C24qabOLoPgyig6ZoPhhQDUpu0ghKJISVKVMwIarXnxI2r4LTJyPS3dMkdol1WS2007tHNTSok',
    { apiVersion: '2020-08-27' }
  );

  stripeTest = this.fb.group({
    name: ['Angular v11', [Validators.required]],
    amount: [1105, [Validators.required, Validators.pattern(/\d+/)]]
  });

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
    locale: 'en'
  };

  paying = false;

  constructor(
    private fb: FormBuilder,
    private plutoService: PlutoService,
    private factory: StripeFactoryService,
    private stripeService: StripeService
  ) {}

  pay() {
    if (this.stripeTest.valid) {
      this.paying = true;
      this.plutoService
        .createPaymentIntent({
          amount: this.stripeTest.get('amount').value,
          currency: 'eur'
        })
        .pipe(
          switchMap(pi =>
            this.stripeService.confirmCardPayment(pi.client_secret, {
              payment_method: {
                card: this.card.element,
                billing_details: {
                  name: this.stripeTest.get('name').value
                }
              }
            })
          )
        )
        .subscribe(result => {
          this.paying = false;
          console.log('Result', result);
          if (result.error) {
            // Show error to your customer (e.g., insufficient funds)
            alert({ success: false, error: result.error.message });
          } else {
            // The payment has been processed!
            if (result.paymentIntent.status === 'succeeded') {
              // Show a success message to your customer
              alert({ success: true });
            }
          }
        });
    } else {
      console.log(this.stripeTest);
    }
  }
}
