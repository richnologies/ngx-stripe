import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';

import { StripeService, StripePaymentElementComponent } from 'ngx-stripe';
import { StripeElementsOptions } from '@stripe/stripe-js';

import { PlutoService } from '../../core';

@Component({
  selector: 'app-payment-element',
  templateUrl: './payment-element.component.html',
  encapsulation: ViewEncapsulation.None
})
export class NgStrPaymentElementComponent implements OnInit {
  @ViewChild(StripePaymentElementComponent) paymentElement: StripePaymentElementComponent;

  stripeTest = this.fb.group({
    name: ['Angular v12', [Validators.required]],
    amount: [1109, [Validators.required, Validators.pattern(/\d+/)]]
  });

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  paying = false;

  constructor(
    private fb: FormBuilder,
    private plutoService: PlutoService,
    private stripeService: StripeService
  ) {}

  ngOnInit() {
    this.plutoService.createPaymentIntent({
      amount: this.stripeTest.get('amount').value,
      currency: 'eur'
    }).subscribe(pi => {
      this.elementsOptions.clientSecret = pi.client_secret;
    });
  }

  pay() {
    if (this.stripeTest.valid) {
      this.paying = true;
      this.stripeService.confirmPayment({
        elements: this.paymentElement.elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: this.stripeTest.get('name').value
            }
          }
        },
        redirect: 'if_required'
      }).subscribe(result => {
        this.paying = false;
        console.log('Result', result);
        if (result.error) {
          // Show error to your customer (e.g., insufficient funds)
          alert(JSON.stringify({ success: false, error: result.error.message }));
        } else {
          // The payment has been processed!
          if (result.paymentIntent.status === 'succeeded') {
            // Show a success message to your customer
            alert(JSON.stringify({ success: true }));
          }
        }
      });
    } else {
      console.log(this.stripeTest);
    }
  }

  // Code Snippets
  paymentElementTS = `
    import { Component, OnInit, ViewChild } from '@angular/core';
    import { FormBuilder, Validators } from '@angular/forms';
    import { HttpClient } from '@angular/common/http';
    import { Observable } from 'rxjs';

    import { StripeService, StripePaymentElementComponent } from 'ngx-stripe';
    import {
      StripeElementsOptions,
      PaymentIntent
    } from '@stripe/stripe-js';

    @Component({
      selector: 'app-test-06',
      templateUrl: './payment-element.component.html'
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

      constructor(
        private http: HttpClient,
        private fb: FormBuilder,
        private stripeService: StripeService
      ) {}

      ngOnInit() {
        this.createPaymentIntent(this.stripeTest.get('amount').value)
          .subscribe(pi => {
            this.elementsOptions.clientSecret = pi.client_secret;
          });
      }

      pay() {
        if (this.stripeTest.valid) {
          this.paying = true;
          this.stripeService.confirmPayment({
            elements: this.paymentElement.elements,
            confirmParams: {
              payment_method_data: {
                billing_details: {
                  name: this.stripeTest.get('name').value
                }
              }
            },
            redirect: 'if_required'
          }).subscribe(result => {
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

      private createPaymentIntent(amount: number): Observable<PaymentIntent> {
        return this.http.post<PaymentIntent>(
          \`\${env.apiUrl}/create-payment-intent\`,
          { amount }
        );
      }
    }
  `;
  paymentElementHTML = `
    <div [formGroup]="stripeTest">
      <mat-form-field class="example-full-width" appearance="fill">
        <input matInput placeholder="name" formControlName="name" />
      </mat-form-field>
      <mat-form-field class="example-full-width" appearance="fill">
        <input matInput placeholder="amount" type="number" formControlName="amount" />
      </mat-form-field>
      <ng-container *ngIf="elementsOptions?.clientSecret as clientSecret">
        <ngx-stripe-payment [clientSecret]="clientSecret">
        </ngx-stripe-payment>
      </ng-container>
      <button (click)="pay()">PAY</button>
    </div>
  `;
  paymentElementServer = `
    const express = require("express");
    const bodyParser = require("body-parser");

    const PORT = 3000;

    const Stripe = require("stripe");
    const stripe = Stripe("***your-stripe-private-key***");

    const app = express();
    app.use(bodyParser.json());
    app.post("/create-payment-intent", (req, res) => {
      stripe.paymentIntents.create(
        {
          amount: parseInt(req.body.amount),
          currency: "usd",
          payment_method_types: ["card"],
        },
        function (err, paymentIntent) {
          if (err) {
            res.status(500).json(err.message);
          } else {
            res.status(201).json(paymentIntent);
          }
        }
      );
    });

    app.listen(PORT, () => console.log(\`Server ready on port \${PORT}\`));
  `;
}
