import { Component, OnInit, ViewChild, inject } from '@angular/core';

import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';

import { StripePaymentElementComponent, injectStripe } from 'ngx-stripe';
import { StripeElementsOptions, StripePaymentElementOptions } from '@stripe/stripe-js';

import { NgStrPlutoService } from '../../core';

import {
  NgStrCodeComponent,
  NgStrCodeGroupComponent,
  NgStrDocsHeaderComponent,
  NgStrFlipContainerComponent,
  NgStrHighlightComponent,
  NgStrLinkComponent,
  NgStrSectionAsideDirective,
  NgStrSectionComponent,
  NgStrSubheaderComponent
} from '../../docs-elements';

@Component({
  selector: 'ngstr-payment-element',
  templateUrl: './payment-element.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    StripePaymentElementComponent,
    NgStrCodeComponent,
    NgStrCodeGroupComponent,
    NgStrDocsHeaderComponent,
    NgStrFlipContainerComponent,
    NgStrHighlightComponent,
    NgStrLinkComponent,
    NgStrSectionComponent,
    NgStrSectionAsideDirective,
    NgStrSubheaderComponent
  ]
})
export default class NgStrPaymentElementComponent implements OnInit {
  @ViewChild(StripePaymentElementComponent)
  paymentElement: StripePaymentElementComponent;

  private readonly fb = inject(UntypedFormBuilder);
  private readonly plutoService = inject(NgStrPlutoService);

  paymentElementForm = this.fb.group({
    name: ['John doe', [Validators.required]],
    email: ['support@ngx-stripe.dev', [Validators.required]],
    address: [''],
    zipcode: [''],
    city: [''],
    amount: [2500, [Validators.required, Validators.pattern(/\d+/)]]
  });

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
    appearance: {
      theme: 'flat'
    }
  };

  paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
      radios: false,
      spacedAccordionItems: false
    }
  };

  stripe = injectStripe(this.plutoService.KEYS.main);
  paying = false;
  completed = false;

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
    import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
    import { UntypedFormBuilder, Validators } from '@angular/forms';

    import {
      injectStripe,
      StripeElementsDirective,
      StripePaymentElementComponent
    } from 'ngx-stripe';
    import {
      StripeElementsOptions, 
      StripePaymentElementOptions
    } from '@stripe/stripe-js';

    import { YourOwnAPIService } from './your-own-api.service';

    @Component({
      selector: 'ngstr-checkout-form',
      templateUrl: './payment-element.component.html',
      standalone: true,
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        StripeElementsDirective,
        StripePaymentElementComponent
      ]
    })
    export class CheckoutFormComponent implements OnInit {
      @ViewChild(StripePaymentElementComponent)
      paymentElement!: StripePaymentElementComponent;

      private readonly fb = inject(UntypedFormBuilder);
      private readonly yourOwnAPI = inject(YourOwnAPIService);

      paymentElementForm = this.fb.group({
        name: ['John doe', [Validators.required]],
        email: ['support@ngx-stripe.dev', [Validators.required]],
        address: [''],
        zipcode: [''],
        city: [''],
        amount: [2500, [Validators.required, Validators.pattern(/\d+/)]]
      });

      elementsOptions: StripeElementsOptions = {
        locale: 'en',
        appearance: {
          theme: 'flat',
        },
      };

      paymentElementOptions: StripePaymentElementOptions = {
        layout: {
          type: 'tabs',
          defaultCollapsed: false,
          radios: false,
          spacedAccordionItems: false
        }
      };

      // Replace with your own public key
      stripe = injectStripe(this.yourOwnAPI.StripePublicKey);
      paying = signal(false);

      ngOnInit() {
        this.yourOwnAPI
          .createPaymentIntent({
            amount: this.paymentElementForm.get('amount').value,
            currency: 'usd'
          })
          .subscribe(pi => {
            this.elementsOptions.clientSecret = pi.client_secret as string;
          });
      }

      pay() {
        if (this.paying() || this.paymentElementForm.invalid) return;
        this.paying.set(true);

        const { name, email, address, zipcode, city } = this.checkoutForm.getRawValue();

        this.stripe
          .confirmPayment({
            elements: this.paymentElement.elements,
            confirmParams: {
              payment_method_data: {
                billing_details: {
                  name: name as string,
                  email: email as string,
                  address: {
                    line1: address as string,
                    postal_code: zipcode as string,
                    city: city as string
                  }
                }
              }
            },
            redirect: 'if_required'
          })
          .subscribe(result => {
            this.paying.set(false);
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
      @if (elementsOptions.clientSecret) {
        <ngx-stripe-elements
          [stripe]="stripe"
          [elementsOptions]="elementsOptions"
        >
          <ngx-stripe-payment [options]="paymentElementOptions" />
        </ngx-stripe-elements>
      }
      <button (click)="pay()">PAY</button>
    </div>
  `;

  paymentElementImplicitTS = `
    import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
    import { UntypedFormBuilder, Validators } from '@angular/forms';

    import { injectStripe, StripePaymentElementComponent } from 'ngx-stripe';
    import {
      StripeElementsOptions, 
      StripePaymentElementOptions
    } from '@stripe/stripe-js';

    import { YourOwnAPIService } from './your-own-api.service';

    @Component({
      selector: 'ngstr-checkout-form',
      templateUrl: './payment-element.component.html',
      standalone: true,
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        StripePaymentElementComponent
      ]
    })
    export class CheckoutFormComponent implements OnInit {
      @ViewChild(StripePaymentElementComponent)
      paymentElement!: StripePaymentElementComponent;

      private readonly fb = inject(UntypedFormBuilder);
      private readonly yourOwnAPI = inject(YourOwnAPIService);

      paymentElementForm = this.fb.group({
        name: ['John doe', [Validators.required]],
        email: ['support@ngx-stripe.dev', [Validators.required]],
        address: [''],
        zipcode: [''],
        city: [''],
        amount: [2500, [Validators.required, Validators.pattern(/\d+/)]]
      });

      elementsOptions: StripeElementsOptions = {
        locale: 'en',
        appearance: {
          theme: 'flat',
        },
      };

      paymentElementOptions: StripePaymentElementOptions = {
        layout: {
          type: 'tabs',
          defaultCollapsed: false,
          radios: false,
          spacedAccordionItems: false
        }
      };

      // Replace with your own public key
      stripe = injectStripe(this.yourOwnAPI.StripePublicKey);
      paying = signal(false);

      ngOnInit() {
        this.yourOwnAPI
          .createPaymentIntent({
            amount: this.paymentElementForm.get('amount').value,
            currency: 'usd'
          })
          .subscribe(pi => {
            this.elementsOptions.clientSecret = pi.client_secret as string;
          });
      }

      pay() {
        if (this.paying() || this.paymentElementForm.invalid) return;
        this.paying.set(true);

        const { name, email, address, zipcode, city } = this.checkoutForm.getRawValue();

        this.stripe
          .confirmPayment({
            elements: this.paymentElement.elements,
            confirmParams: {
              payment_method_data: {
                billing_details: {
                  name: name as string,
                  email: email as string,
                  address: {
                    line1: address as string,
                    postal_code: zipcode as string,
                    city: city as string
                  }
                }
              }
            },
            redirect: 'if_required'
          })
          .subscribe(result => {
            this.paying.set(false);
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
      }
    }
  `;

  paymentElementImplicitHTML = `
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
      @if (elementsOptions.clientSecret) {
        <ngx-stripe-payment
          [stripe]="stripe"
          [elementsOptions]="elementsOptions"
          [options]="paymentElementOptions"
        />
      }
      <button (click)="pay()">PAY</button>
    </div>
  `;

  paymentElementFetchTS = `
    import { Component, inject, ViewChild } from '@angular/core';
    import { UntypedFormBuilder, Validators } from '@angular/forms';

    import {
      injectStripe,
      StripeElementsDirective,
      StripePaymentElementComponent
    } from 'ngx-stripe';
    import {
      StripeElementsOptions, 
      StripePaymentElementOptions
    } from '@stripe/stripe-js';

    @Component({
      selector: 'ngstr-checkout-form',
      templateUrl: './payment-element.component.html',
      standalone: true,
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        StripeElementsDirective,
        StripePaymentElementComponent
      ]
    })
    export class CheckoutFormComponent {
      @ViewChild(StripePaymentElementComponent)
      paymentElement!: StripePaymentElementComponent;
      @ViewChild(StripeElementsDirective)
      elements!: StripeElementsDirective;

      private readonly fb = inject(UntypedFormBuilder);

      paymentElementForm = this.fb.group({
        name: ['John doe', [Validators.required]],
        email: ['support@ngx-stripe.dev', [Validators.required]],
        address: [''],
        zipcode: [''],
        city: [''],
        amount: [2500, [Validators.required, Validators.pattern(/\d+/)]]
      });

      elementsOptions: StripeElementsOptions = {
        locale: 'en',
        appearance: {
          theme: 'flat',
        },
        clientSecret: '{{ YOUR_CLIENT_SECRET }}'
      };

      paymentElementOptions: StripePaymentElementOptions = {
        layout: {
          type: 'tabs',
          defaultCollapsed: false,
          radios: false,
          spacedAccordionItems: false
        }
      };

      stripe = injectStripe({{ YOUR_STRIPE_PUBLIC_KEY }});

      fetchUpdates() {
        this.paymentElement.fetchUpdates();
      }

      // It's the same method as above. Just to show that you can use it on the elements directive
      fetchUpdatesFromElements() {
        this.elements.fetchUpdates();
      }

      update(options: Partial<StripePaymentElementOptions>) {
        this.paymentElement.update(options);
      }
    }
  `;

  paymentElementCollapseTS = `
    import { Component, inject, ViewChild } from '@angular/core';
    import { UntypedFormBuilder, Validators } from '@angular/forms';

    import {
      injectStripe,
      StripeElementsDirective,
      StripePaymentElementComponent
    } from 'ngx-stripe';
    import {
      StripeElementsOptions, 
      StripePaymentElementOptions
    } from '@stripe/stripe-js';

    @Component({
      selector: 'ngstr-checkout-form',
      templateUrl: './payment-element.component.html',
      standalone: true,
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        StripeElementsDirective,
        StripePaymentElementComponent
      ]
    })
    export class CheckoutFormComponent {
      @ViewChild(StripePaymentElementComponent)
      paymentElement!: StripePaymentElementComponent;

      private readonly fb = inject(UntypedFormBuilder);

      paymentElementForm = this.fb.group({
        name: ['John doe', [Validators.required]],
        email: ['support@ngx-stripe.dev', [Validators.required]],
        address: [''],
        zipcode: [''],
        city: [''],
        amount: [2500, [Validators.required, Validators.pattern(/\d+/)]]
      });

      elementsOptions: StripeElementsOptions = {
        locale: 'en',
        appearance: {
          theme: 'flat',
        },
        clientSecret: '{{ YOUR_CLIENT_SECRET }}'
      };

      paymentElementOptions: StripePaymentElementOptions = {
        layout: {
          type: 'tabs',
          defaultCollapsed: false,
          radios: false,
          spacedAccordionItems: false
        }
      };

      stripe = injectStripe({{ YOUR_STRIPE_PUBLIC_KEY }});

      collapse() {
        this.paymentElement.collapse();
      }
    }
  `;
}
