import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { StripeService, StripePaymentElementComponent } from 'ngx-stripe';
import { StripeElementsOptions } from '@stripe/stripe-js';

import { NgStrPlutoService } from '../../core';

@Component({
  selector: 'ngstr-test-06',
  template: `
    <div maxWidth="900">
      <div color="secondary" section-content-header>
        <span>Payment Element Test</span>
      </div>
      <div section-content [formGroup]="stripeTest">
        <input matInput placeholder="name" formControlName="name" />
        <input matInput placeholder="amount" type="number" formControlName="amount" />
        <ng-container *ngIf="elementsOptions?.clientSecret as clientSecret">
          <ngx-stripe-payment [clientSecret]="clientSecret"></ngx-stripe-payment>
        </ng-container>
        <button (click)="pay()">PAY</button>
      </div>
    </div>
  `,
  styles: []
})
export class Test06Component implements OnInit {
  @ViewChild(StripePaymentElementComponent)
  paymentElement: StripePaymentElementComponent;

  stripeTest = this.fb.group({
    name: ['Angular v12', [Validators.required]],
    amount: [1109, [Validators.required, Validators.pattern(/\d+/)]]
  });

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  paying = false;

  constructor(private fb: FormBuilder, private plutoService: NgStrPlutoService, private stripeService: StripeService) {}

  ngOnInit() {
    this.plutoService
      .createPaymentIntent({
        amount: this.stripeTest.get('amount').value,
        currency: 'eur'
      })
      .subscribe((pi) => {
        this.elementsOptions.clientSecret = pi.client_secret;
      });
  }

  pay() {
    if (this.stripeTest.valid) {
      this.paying = true;
      this.stripeService
        .confirmPayment({
          elements: this.paymentElement.elements,
          confirmParams: {
            payment_method_data: {
              billing_details: {
                name: this.stripeTest.get('name').value
              }
            }
          },
          redirect: 'if_required'
        })
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
