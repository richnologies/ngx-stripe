import { Component, ViewChild, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

import { StripeCardComponent, injectStripe } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';

import { NgStrPlutoService } from '../core';

@Component({
  selector: 'ngstr-card-payment-intent-example',
  template: `
    <div maxWidth="900">
      <div color="secondary" section-content-header>
        <span>Card Payment Intent Example</span>
      </div>
      <div section-content [formGroup]="stripeTest">
        <input placeholder="name" formControlName="name" />
        <input placeholder="amount" type="number" formControlName="amount" />
        <ngx-stripe-card [stripe]="stripe" [options]="cardOptions">
          <span class="text-green-400" *ngxStripeLoadingTemplate> Loading Stripe Card... </span>
        </ngx-stripe-card>
        <button (click)="pay()">PAY</button>
      </div>
    </div>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, StripeCardComponent]
})
export default class CardPaymentIntentExampleComponent {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  private readonly fb = inject(UntypedFormBuilder);
  private readonly plutoService = inject(NgStrPlutoService);

  stripe = injectStripe(this.plutoService.KEYS.main);

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

  pay() {
    if (this.stripeTest.valid) {
      this.paying = true;
      this.plutoService
        .createPaymentIntent({
          amount: this.stripeTest.get('amount').value,
          currency: 'eur'
        })
        .pipe(
          switchMap((pi) =>
            this.stripe.confirmCardPayment(pi.client_secret, {
              payment_method: {
                card: this.card.element,
                billing_details: {
                  name: this.stripeTest.get('name').value
                }
              }
            })
          )
        )
        .subscribe((result) => {
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
