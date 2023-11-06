import { Component, ViewChild } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import {
  StripeCardComponent,
  StripeCardCvcComponent,
  StripeCardExpiryComponent,
  StripeCardGroupDirective,
  StripeCardNumberComponent,
  StripeFactoryService
} from 'ngx-stripe';

import { NgStrPlutoService } from '../../core';
import { DocsElementsModule } from '../../docs-elements/docs-elements.module';

@Component({
  selector: 'ngstr-element-components',
  templateUrl: './element-components.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DocsElementsModule,
    StripeCardGroupDirective,
    StripeCardCvcComponent,
    StripeCardExpiryComponent,
    StripeCardNumberComponent,
    StripeCardComponent
  ]
})
export class NgStrElementComponentsComponent {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  createTokenForm = this.fb.group({
    name: ['John Doe', [Validators.required]],
    email: ['support@ngx-stripe.dev', [Validators.required]]
  });

  cardGroupForm = this.fb.group({
    name: ['John Doe', [Validators.required]],
    email: ['support@ngx-stripe.dev', [Validators.required]],
    amount: [2500, [Validators.required]]
  });

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        backgroundColor: '#FFF',
        color: '#000',
        fontWeight: '300',
        fontFamily: 'Inter, Open Sans, Segoe UI, sans-serif',
        fontSize: '16px',
        '::placeholder': {
          color: '#666'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  stripe = this.stripeFactory.create(this.plutoService.KEYS.main);
  creatingToken = false;
  paying = false;

  constructor(
    private fb: UntypedFormBuilder,
    private plutoService: NgStrPlutoService,
    private stripeFactory: StripeFactoryService
  ) {}

  createToken() {
    const name = this.createTokenForm.get('name').value;
    this.creatingToken = true;
    this.stripe.createToken(this.card.element, { name }).subscribe((result) => {
      this.creatingToken = false;
      if (result.token) {
        // Use the token
        alert(JSON.stringify({ success: true, token: result.token.id }));
      } else if (result.error) {
        // Error creating the token
        alert(JSON.stringify({ success: false, error: result.error.message }));
      }
    });
  }

  pay() {
    if (this.cardGroupForm.valid) {
      this.plutoService
        .createPaymentIntent({
          amount: this.cardGroupForm.get('amount').value,
          currency: 'usd'
        })
        .pipe(
          switchMap((pi) =>
            this.stripe.confirmCardPayment(pi.client_secret, {
              payment_method: {
                card: this.card.element,
                billing_details: {
                  name: this.cardGroupForm.get('name').value
                }
              }
            })
          )
        )
        .subscribe((result) => {
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
      console.log(this.cardGroupForm);
    }
  }

  createTokenTS = `
    import { Component, OnInit, ViewChild } from '@angular/core';
    import { FormGroup, FormBuilder, Validators } from "@angular/forms";

    import { StripeService, StripeCardComponent } from 'ngx-stripe';
    import {
      StripeCardElementOptions,
      StripeElementsOptions
    } from '@stripe/stripe-js';

    @Component({
      selector: 'app-create-token',
      templateUrl: './create-token.component.html',
    })
    export class CreateTokenComponent implements OnInit {
      @ViewChild(StripeCardComponent) card: StripeCardComponent;

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

      stripeTest: FormGroup;

      constructor(private fb: FormBuilder, private stripeService: StripeService) {}

      ngOnInit(): void {
        this.stripeTest = this.fb.group({
          name: ['', [Validators.required]]
        });
      }

      createToken(): void {
        const name = this.stripeTest.get('name').value;
        this.stripeService
          .createToken(this.card.element, { name })
          .subscribe((result) => {
            if (result.token) {
              // Use the token
              console.log(result.token.id);
            } else if (result.error) {
              // Error creating the token
              console.log(result.error.message);
            }
          });
      }
    }
  `;
  createTokenHTML = `
    <h2>Create Token Example</h2>
    <ngx-stripe-card
      [options]="cardOptions"
      [elementsOptions]="elementsOptions"
    ></ngx-stripe-card>
    <button type="submit" (click)="createToken()">
      CREATE TOKEN
    </button>
  `;
  cardGroupDirectiveTS = `
    import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
    import { FormGroup, FormBuilder, Validators } from '@angular/forms';
    import { HttpClient } from '@angular/common/http';
    import { Observable } from 'rxjs';
    import { switchMap } from 'rxjs/operators';

    import { StripeService, StripeCardNumberComponent } from 'ngx-stripe';
    import {
      StripeCardElementOptions,
      StripeElementsOptions,
      PaymentIntent,
    } from '@stripe/stripe-js';

    import { environment as env } from '../../environments/environment';

    @Component({
      selector: 'app-simple-payment-intent',
      templateUrl: './simple-payment-intent.component.html',
      styleUrls: ['./simple-payment-intent.component.css'],
    })
    export class SimplePaymentIntentComponent implements OnInit {
      @ViewChild(StripeCardNumberComponent) card: StripeCardNumberComponent;

      cardOptions: StripeCardElementOptions = {
        style: {
          base: {
            iconColor: '#666EE8',
            color: '#31325F',
            fontWeight: '300',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSize: '18px',
            '::placeholder': {
              color: '#CFD7E0',
            },
          },
        },
      };

      elementsOptions: StripeElementsOptions = {
        locale: 'es',
      };

      stripeTest: FormGroup;

      constructor(
        private http: HttpClient,
        private fb: FormBuilder,
        private stripeService: StripeService
      ) {}

      ngOnInit(): void {
        this.stripeTest = this.fb.group({
          name: ['Angular v10', [Validators.required]],
          amount: [1001, [Validators.required, Validators.pattern(/\d+/)]],
        });
      }

      pay(): void {
        if (this.stripeTest.valid) {
          this.createPaymentIntent(this.stripeTest.get('amount').value)
            .pipe(
              switchMap((pi) =>
                this.stripeService.confirmCardPayment(pi.client_secret, {
                  payment_method: {
                    card: this.card.element,
                    billing_details: {
                      name: this.stripeTest.get('name').value,
                    },
                  },
                })
              )
            )
            .subscribe((result) => {
              if (result.error) {
                // Show error to your customer (e.g., insufficient funds)
                console.log(result.error.message);
              } else {
                // The payment has been processed!
                if (result.paymentIntent.status === 'succeeded') {
                  // Show a success message to your customer
                }
              }
            });
        } else {
          console.log(this.stripeTest);
        }
      }

      createPaymentIntent(amount: number): Observable<PaymentIntent> {
        return this.http.post<PaymentIntent>(
          \`\${env.apiUrl}/create-payment-intent\`,
          { amount }
        );
      }
    }
  `;
  cardGroupDirectiveHTML = `
    <div
      ngxStripeCardGroup
      [formGroup]="stripeTest"
      [elementsOptions]="elementsOptions"
    >
      <input formControlName="name" />
      <input formControlName="amount" />
      <ngx-stripe-card-number [options]="cardOptions"></ngx-stripe-card-number>
      <ngx-stripe-card-expiry [options]="cardOptions"></ngx-stripe-card-expiry>
      <ngx-stripe-card-cvc [options]="cardOptions"></ngx-stripe-card-cvc>
      <button type="submit" (click)="pay()">
        PAY
      </button>
    </div>
  `;
  cardGroupComponentTS = `
    import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
    import { FormGroup, FormBuilder, Validators } from '@angular/forms';
    import { HttpClient } from '@angular/common/http';
    import { Observable } from 'rxjs';
    import { switchMap } from 'rxjs/operators';

    import { StripeService, StripeCardNumberComponent } from 'ngx-stripe';
    import {
      StripeCardElementOptions,
      StripeElementsOptions,
      PaymentIntent,
    } from '@stripe/stripe-js';

    import { environment as env } from '../../environments/environment';

    @Component({
      selector: 'app-simple-payment-intent',
      templateUrl: './simple-payment-intent.component.html',
      styleUrls: ['./simple-payment-intent.component.css'],
    })
    export class SimplePaymentIntentComponent implements OnInit {
      @ViewChild(StripeCardNumberComponent) card: StripeCardNumberComponent;

      cardOptions: StripeCardElementOptions = {
        style: {
          base: {
            iconColor: '#666EE8',
            color: '#31325F',
            fontWeight: '300',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSize: '18px',
            '::placeholder': {
              color: '#CFD7E0',
            },
          },
        },
      };

      elementsOptions: StripeElementsOptions = {
        locale: 'es',
      };

      stripeTest: FormGroup;

      constructor(
        private http: HttpClient,
        private fb: FormBuilder,
        private stripeService: StripeService
      ) {}

      ngOnInit(): void {
        this.stripeTest = this.fb.group({
          name: ['Angular v10', [Validators.required]],
          amount: [1001, [Validators.required, Validators.pattern(/\d+/)]],
        });
      }

      pay(): void {
        if (this.stripeTest.valid) {
          this.createPaymentIntent(this.stripeTest.get('amount').value)
            .pipe(
              switchMap((pi) =>
                this.stripeService.confirmCardPayment(pi.client_secret, {
                  payment_method: {
                    card: this.card.element,
                    billing_details: {
                      name: this.stripeTest.get('name').value,
                    },
                  },
                })
              )
            )
            .subscribe((result) => {
              if (result.error) {
                // Show error to your customer (e.g., insufficient funds)
                console.log(result.error.message);
              } else {
                // The payment has been processed!
                if (result.paymentIntent.status === 'succeeded') {
                  // Show a success message to your customer
                }
              }
            });
        } else {
          console.log(this.stripeTest);
        }
      }

      createPaymentIntent(amount: number): Observable<PaymentIntent> {
        return this.http.post<PaymentIntent>(
          \`\${env.apiUrl}/create-payment-intent\`,
          { amount }
        );
      }
    }
  `;
  cardGroupComponentHTML = `
    <ngx-stripe-card-group
      [formGroup]="stripeTest"
      [elementsOptions]="elementsOptions"
    >
      <input formControlName="name" />
      <input formControlName="amount" />
      <ngx-stripe-card-number [options]="cardOptions"></ngx-stripe-card-number>
      <ngx-stripe-card-expiry [options]="cardOptions"></ngx-stripe-card-expiry>
      <ngx-stripe-card-cvc [options]="cardOptions"></ngx-stripe-card-cvc>
      <button type="submit" (click)="pay()">
        PAY
      </button>
    </ngx-stripe-card-group>
  `;
}
