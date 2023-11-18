import { Component, ViewChild, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';

import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import {
  StripeCardComponent,
  StripeCardCvcComponent,
  StripeCardExpiryComponent,
  StripeCardGroupDirective,
  StripeCardNumberComponent,
  StripeElementsDirective,
  injectStripe
} from 'ngx-stripe';

import { NgStrPlutoService } from '../../core';

import {
  NgStrBadgeComponent,
  NgStrCodeComponent,
  NgStrCodeGroupComponent,
  NgStrContainerComponent,
  NgStrDocsHeaderComponent,
  NgStrHighlightComponent,
  NgStrLinkComponent,
  NgStrSectionAsideDirective,
  NgStrSectionComponent,
  NgStrSubheaderComponent
} from '../../docs-elements';

@Component({
  selector: 'ngstr-card-elements',
  templateUrl: './card-elements.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDividerModule,
    MatTabsModule,
    StripeElementsDirective,
    StripeCardGroupDirective,
    StripeCardCvcComponent,
    StripeCardExpiryComponent,
    StripeCardNumberComponent,
    StripeCardComponent,
    NgStrBadgeComponent,
    NgStrCodeComponent,
    NgStrCodeGroupComponent,
    NgStrContainerComponent,
    NgStrDocsHeaderComponent,
    NgStrHighlightComponent,
    NgStrLinkComponent,
    NgStrSectionComponent,
    NgStrSectionAsideDirective,
    NgStrSubheaderComponent
  ]
})
export default class NgStrCardElementsComponent {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  private readonly fb = inject(UntypedFormBuilder);
  private readonly plutoService = inject(NgStrPlutoService);

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

  stripe = injectStripe(this.plutoService.KEYS.main);
  creatingToken = false;
  paying = false;

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

  oneElementTS = `
    import { Component, inject, ViewChild } from '@angular/core';
    import { UntypedFormBuilder, Validators } from '@angular/forms';

    import { MatInputModule } from '@angular/material/input';

    import {
      injectStripe,
      StripeElementsDirective
      StripeCardComponent
    } from 'ngx-stripe';
    import {
      StripeElementsOptions,
      StripeCardElementOptions
    } from '@stripe/stripe-js';

    @Component({
      selector: 'ngstre-one-element-card',
      template: \`
        <h2>Card Example</h2>
        <div [formGroup]="checkoutForm">
          <mat-form-field class="example-full-width" appearance="fill">
            <input matInput placeholder="name" formControlName="name" />
          </mat-form-field>
          <mat-form-field class="example-full-width" appearance="fill">
            <input matInput placeholder="Email" type="email" formControlName="email" />
          </mat-form-field>
          <ngx-stripe-elements
            [stripe]="stripe"
            [elementsOptions]="elementsOptions"
          >
            <ngx-stripe-card [options]="cardOptions" />
          </ngx-stripe-elements>
        </div>
        <button type="submit" (click)="createToken()">
          CREATE TOKEN
        </button>
      \`,
      standalone: true,
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        StripeElementsDirective,
        StripeCardComponent
      ]
    })
    export class CreateTokenComponent {
      @ViewChild(StripeCardComponent) cardElement!: StripeCardComponent;

      private readonly fb = inject(UntypedFormBuilder);

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

      checkoutForm = this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]]
      });

      // Replace with your own public key
      stripe = injectStripe(this.yourOwnAPI.StripePublicKey);

      createToken() {
        const name = this.stripeTest.get('name').value;
        this.stripe
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
