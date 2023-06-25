import { Component, OnInit, ViewChild } from '@angular/core';

import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';

import { StripePaymentElementComponent, StripeFactoryService } from 'ngx-stripe';
import { StripeElementsOptions } from '@stripe/stripe-js';

import { NgStrPlutoService } from '../../core';
import { DocsElementsModule } from '../../docs-elements/docs-elements.module';

@Component({
  selector: 'ngstr-payment-element',
  templateUrl: './payment-element.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, DocsElementsModule]
})
export class NgStrPaymentElementComponent implements OnInit {
  @ViewChild(StripePaymentElementComponent)
  paymentElement: StripePaymentElementComponent;

  paymentElementForm = this.fb.group({
    name: ['John doe', [Validators.required]],
    email: ['support@ngx-stripe.dev', [Validators.required]],
    address: [''],
    zipcode: [''],
    city: [''],
    amount: [2500, [Validators.required, Validators.pattern(/\d+/)]]
  });

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  stripe = this.stripeFactory.create(this.plutoService.KEYS.main);
  paying = false;
  completed = false;

  constructor(
    private fb: UntypedFormBuilder,
    private plutoService: NgStrPlutoService,
    private stripeFactory: StripeFactoryService
  ) {}

  ngOnInit() {
    this.plutoService
      .createPaymentIntent({
        amount: this.paymentElementForm.get('amount').value,
        currency: 'usd'
      })
      .subscribe((pi) => {
        this.elementsOptions.clientSecret = pi.client_secret;
      });
  }

  pay() {
    if (this.paymentElementForm.valid) {
      this.paying = true;
      this.stripe
        .confirmPayment({
          elements: this.paymentElement.elements,
          confirmParams: {
            payment_method_data: {
              billing_details: {
                name: this.paymentElementForm.get('name').value,
                email: this.paymentElementForm.get('email').value,
                address: {
                  line1: this.paymentElementForm.get('address').value || '',
                  postal_code: this.paymentElementForm.get('zipcode').value || '',
                  city: this.paymentElementForm.get('city').value || ''
                }
              }
            }
          },
          redirect: 'if_required'
        })
        .subscribe((result) => {
          this.paying = false;
          console.log(result);
          if (result.error) {
            // Show error to your customer (e.g., insufficient funds)
            alert(JSON.stringify({ success: false, error: result.error.message }));
          } else {
            // The payment has been processed!
            if (result.paymentIntent.status === 'succeeded') {
              // Show a success message to your customer
              this.completed = true;
            }
          }
        });
    } else {
      console.log(this.paymentElementForm);
    }
  }

  clearPaymentElementForm() {
    this.paymentElementForm.patchValue({
      name: '',
      email: '',
      address: '',
      zipcode: '',
      city: ''
    });

    this.completed = false;
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
      selector: 'ngstr-test-06',
      templateUrl: './payment-element.component.html'
    })
    export class Test06Component implements OnInit {
      @ViewChild(StripePaymentElementComponent)
      paymentElement: StripePaymentElementComponent;

      paymentElementForm = this.fb.group({
        name: ['John doe', [Validators.required]],
        email: ['support@ngx-stripe.dev', [Validators.required]],
        address: [''],
        zipcode: [''],
        city: [''],
        amount: [2500, [Validators.required, Validators.pattern(/\d+/)]]
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
        this.createPaymentIntent(this.paymentElementForm.get('amount').value)
          .subscribe(pi => {
            this.elementsOptions.clientSecret = pi.client_secret;
          });
      }

      pay() {
        if (this.paymentElementForm.valid) {
          this.paying = true;
          this.stripeService.confirmPayment({
            elements: this.paymentElement.elements,
            confirmParams: {
              payment_method_data: {
                billing_details: {
                  name: this.paymentElementForm.get('name').value,
                  email: this.paymentElementForm.get('email').value,
                  address: {
                    line1: this.paymentElementForm.get('address').value || '',
                    postal_code: this.paymentElementForm.get('zipcode').value || '',
                    city: this.paymentElementForm.get('city').value || '',
                  }
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
          console.log(this.paymentElementForm);
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
    <div [formGroup]="paymentElementForm">
      <mat-form-field class="example-full-width" appearance="fill">
        <input matInput placeholder="name" formControlName="name" />
      </mat-form-field>
      <mat-form-field class="example-full-width" appearance="fill">
        <input matInput placeholder="Email" type="email" formControlName="email" />
      </mat-form-field>
      <mat-form-field class="example-full-width" appearance="fill">
        <input matInput placeholder="Address" formControlName="address" />
      </mat-form-field>
      <mat-form-field class="example-full-width" appearance="fill">
        <input matInput placeholder="ZIP Code" formControlName="zipcode" />
      </mat-form-field>
      <mat-form-field class="example-full-width" appearance="fill">
        <input matInput placeholder="city" formControlName="city" />
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
