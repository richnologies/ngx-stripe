import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';

import { StripeFpxBankComponent, StripeFactoryService } from 'ngx-stripe';

import { NgStrPlutoService } from '../core';

@Component({
  selector: 'ngstr-fpx-example',
  template: `
    <div maxWidth="900">
      <div color="secondary" section-content-header>
        <span>FPX Payment Test</span>
      </div>
      <div section-content [formGroup]="stripeTest">
        <input matInput placeholder="name" formControlName="name" />
        <input matInput placeholder="amount" type="number" formControlName="amount" />
        <ngx-stripe-fpx-bank [stripe]="stripe"></ngx-stripe-fpx-bank>
        <button (click)="pay()">PAY</button>
      </div>
    </div>
  `,
  styles: [],
  standalone: true,
  imports: [ReactiveFormsModule, StripeFpxBankComponent]
})
export class FpxExampleComponent implements OnInit {
  @ViewChild(StripeFpxBankComponent) fpxPayment: StripeFpxBankComponent;

  stripeTest = this.fb.group({
    name: ['FPX - Test', [Validators.required]],
    amount: [1109, [Validators.required, Validators.pattern(/\d+/)]]
  });

  stripe = this.stripeFactory.create(this.plutoService.KEYS.main);
  elementOptions = {
    style: {
      base: {
        padding: '10px 12px',
        color: '#32325d',
        fontSize: '16px'
      }
    },
    accountHolderType: 'individual'
  };

  paying = false;
  clientSecret: string;

  constructor(
    private fb: UntypedFormBuilder,
    private plutoService: NgStrPlutoService,
    private stripeFactory: StripeFactoryService
  ) {}

  ngOnInit() {
    this.plutoService
      .createPaymentIntent({
        payment_method_types: ['fpx'],
        amount: this.stripeTest.get('amount').value,
        currency: 'myr'
      })
      .subscribe((pi) => {
        this.clientSecret = pi.client_secret;
      });
  }

  pay() {
    if (this.stripeTest.valid) {
      this.paying = true;

      this.stripe
        .confirmFpxPayment(this.clientSecret, {
          payment_method: {
            fpx: this.fpxPayment.element
          },
          return_url: ''
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
