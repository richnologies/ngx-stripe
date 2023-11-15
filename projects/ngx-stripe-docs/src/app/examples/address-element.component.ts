import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';

import {
  StripePaymentElementComponent,
  StripeAddressComponent,
  StripeElementsDirective,
  injectStripe
} from 'ngx-stripe';
import { StripeAddressElementOptions, StripeElementsOptions } from '@stripe/stripe-js';

import { NgStrPlutoService } from '../core';

@Component({
  selector: 'ngstr-address-element-example',
  template: `
    <div maxWidth="900">
      <div color="secondary" section-content-header>
        <span>Address Element</span>
      </div>
      <div section-content [formGroup]="stripeTest">
        <ngx-stripe-address [stripe]="stripe" [options]="addressOptions" />

        <input matInput placeholder="name" formControlName="name" />
        <input matInput placeholder="amount" type="number" formControlName="amount" />
        @if (elementsOptions?.clientSecret; as clientSecret) {
          <ng-container
            ngxStripeElements
            [stripe]="stripe"
            [elementsOptions]="elementsOptions"
          >
            <ngx-stripe-address [options]="addressOptions" />
            <ngx-stripe-payment />
          </ng-container>
        }
        <button (click)="pay()">PAY</button>
      </div>
    </div>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, StripeAddressComponent, StripePaymentElementComponent, StripeElementsDirective]
})
export default class AddressElementExampleComponent implements OnInit, AfterViewInit {
  @ViewChild(StripeAddressComponent) addressElement: StripeAddressComponent;
  @ViewChild(StripePaymentElementComponent)
  paymentElement: StripePaymentElementComponent;

  private readonly fb = inject(UntypedFormBuilder);
  private readonly plutoService = inject(NgStrPlutoService);

  stripeTest = this.fb.group({
    name: ['Angular v12', [Validators.required]],
    amount: [1109, [Validators.required, Validators.pattern(/\d+/)]]
  });

  stripe = injectStripe(this.plutoService.KEYS.main);
  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };
  addressOptions: StripeAddressElementOptions = {
    mode: 'shipping'
  };

  paying = false;

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

  ngAfterViewInit() {
    this.addressElement.change.subscribe(async (ev) => {
      console.log('Address Event', ev);

      const { complete, value } = await this.addressElement.getValue();

      console.log('Address fetched value', value);
    });
  }

  pay() {
    if (this.stripeTest.valid) {
      this.paying = true;
      this.stripe
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
