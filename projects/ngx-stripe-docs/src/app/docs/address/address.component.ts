import { Component } from '@angular/core';

import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';

import {
  NgStrBadgeComponent,
  NgStrCodeComponent,
  NgStrCodeGroupComponent,
  NgStrContainerComponent,
  NgStrDocsHeaderComponent,
  NgStrHighlightComponent,
  NgStrLinkComponent,
  NgStrPanelComponent,
  NgStrSectionComponent,
  NgStrSubheaderComponent
} from '../../docs-elements';

@Component({
  selector: 'ngstr-address',
  templateUrl: './address.component.html',
  standalone: true,
  imports: [
    MatDividerModule,
    MatTabsModule,
    NgStrBadgeComponent,
    NgStrCodeComponent,
    NgStrCodeGroupComponent,
    NgStrContainerComponent,
    NgStrDocsHeaderComponent,
    NgStrHighlightComponent,
    NgStrLinkComponent,
    NgStrPanelComponent,
    NgStrSectionComponent,
    NgStrSubheaderComponent
  ]
})
export default class NgStrAddressComponent {
  createAddressHTML = `
    <div [formGroup]="addressElementForm">
      <mat-form-field class="example-full-width" appearance="fill">
        <input matInput placeholder="name" formControlName="name" />
      </mat-form-field>
      <mat-form-field class="example-full-width" appearance="fill">
        <input matInput placeholder="Email" type="email" formControlName="email" />
      </mat-form-field>
      @if (elementsOptions.clientSecret) {
        <ngx-stripe-elements
          [stripe]="stripe"
          [elementsOptions]="elementsOptions"
        >
          <ngx-stripe-address #shippingAddress [options]="shippingAddressOptions" />
          <ngx-stripe-address #billingAddress [options]="billingAddressOptions" />
        </ngx-stripe-elements>
      }
      <button (click)="pay()">PAY</button>
    </div>
  `;

  createAddressTS = `
    import { Component, inject, OnInit, ViewChild } from '@angular/core';
    import { UntypedFormBuilder, Validators } from '@angular/forms';
    
    import { MatInputModule } from '@angular/material/input';

    import {
      injectStripe,
      StripeElementsDirective,
      StripeAddressComponent
    } from 'ngx-stripe';
    import {
      StripeElementsOptions, 
      StripeAddressElementOptions
    } from '@stripe/stripe-js';

    import { YourOwnAPIService } from './your-own-api.service';

    @Component({
      selector: 'ngstr-checkout-form',
      templateUrl: './address-element.component.html',
      standalone: true,
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        StripeElementsDirective,
        StripeAddressComponent
      ]
    })
    export class CheckoutFormComponent implements OnInit {
      @ViewChild('shippingAddress') shippingAddress!: StripeAddressComponent;

      private readonly fb = inject(UntypedFormBuilder);
      private readonly yourOwnAPI = inject(YourOwnAPIService);

      addressElementForm = this.fb.group({
        name: ['John doe', [Validators.required]],
        email: ['support@ngx-stripe.dev', [Validators.required]],
        amount: [2500, [Validators.required, Validators.pattern(/\d+/)]]
      });

      elementsOptions: StripeElementsOptions = {
        locale: 'en',
        appearance: {
          theme: 'flat'
        },
      };

      shippingAddressOptions: StripeAddressElementOptions = {
        mode: 'shipping'
      };

      billingAddressOptions: StripeAddressElementOptions = {
        mode: 'billing'
      };

      // Replace with your own public key
      stripe = injectStripe(this.yourOwnAPI.StripePublicKey);

      ngOnInit() {
        this.yourOwnAPI
          .createPaymentIntent({
            amount: this.addressElementForm.get('amount').value,
            currency: 'usd'
          })
          .subscribe(pi => {
            this.elementsOptions.clientSecret = pi.client_secret as string;
          });
      }

      pay() {
        // ... handle payment here
      }
    }
  `;

  getAddressTS = `
    import { Component, inject, OnInit, ViewChild } from '@angular/core';
    import { UntypedFormBuilder, Validators } from '@angular/forms';

    import { MatInputModule } from '@angular/material/input';

    import {
      injectStripe,
      StripeElementsDirective,
      StripeAddressComponent
    } from 'ngx-stripe';
    import {
      StripeElementsOptions, 
      StripeAddressElementOptions
    } from '@stripe/stripe-js';

    import { YourOwnAPIService } from './your-own-api.service';

    @Component({
      selector: 'ngstr-checkout-form',
      templateUrl: './address-element.component.html',
      standalone: true,
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        StripeElementsDirective,
        StripeAddressComponent
      ]
    })
    export class CheckoutFormComponent implements OnInit {
      @ViewChild('shippingAddress') shippingAddress!: StripeAddressComponent;

      private readonly fb = inject(UntypedFormBuilder);
      private readonly yourOwnAPI = inject(YourOwnAPIService);

      addressElementForm = this.fb.group({
        name: ['John doe', [Validators.required]],
        email: ['support@ngx-stripe.dev', [Validators.required]],
        amount: [2500, [Validators.required, Validators.pattern(/\d+/)]]
      });

      elementsOptions: StripeElementsOptions = {
        locale: 'en',
        appearance: {
          theme: 'flat'
        },
      };

      shippingAddressOptions: StripeAddressElementOptions = {
        mode: 'shipping'
      };

      billingAddressOptions: StripeAddressElementOptions = {
        mode: 'billing'
      };

      // Replace with your own public key
      stripe = injectStripe(this.yourOwnAPI.StripePublicKey);

      ngOnInit() {
        this.yourOwnAPI
          .createPaymentIntent({
            amount: this.addressElementForm.get('amount').value,
            currency: 'usd'
          })
          .subscribe(pi => {
            this.elementsOptions.clientSecret = pi.client_secret as string;
          });
      }

      async getAddressValue() {
        const result = await this.shippingAddress.getValue();
        const { complete, isNewAddress, value } = result;

        // if complete is true, you can allow the user to the next step
        // Optionally: you can use value to store address details
      }

      pay() {
        // ... handle payment here
      }
    }
  `;

  addressWithLinkHTML = `
    <div [formGroup]="addressElementForm">
      <mat-form-field class="example-full-width" appearance="fill">
        <input matInput placeholder="name" formControlName="name" />
      </mat-form-field>
      @if (elementsOptions.clientSecret) {
        <ngx-stripe-elements
          [stripe]="stripe"
          [elementsOptions]="elementsOptions"
        >
          <ngx-stripe-link-authentication [options]="linkOptions" />
          <ngx-stripe-address [options]="shippingAddressOptions" />
          <ngx-stripe-address [options]="billingAddressOptions" />
          <ngx-stripe-payment [options]="paymentElementOptions" />
        </ngx-stripe-elements>
      }
      <button (click)="pay()">PAY</button>
    </div>
  `;

  addressWithLinkTS = `
    import { Component, inject, OnInit, signal } from '@angular/core';
    import { UntypedFormBuilder, Validators } from '@angular/forms';

    import { MatInputModule } from '@angular/material/input';

    import {
      injectStripe,
      StripeElementsDirective,
      StripeLinkAuthenticationComponent,
      StripeAddressComponent,
      StripePaymentElementComponent
    } from 'ngx-stripe';
    import {
      StripeElementsOptions,
      StripeLinkAuthenticationElementOptions,
      StripeAddressElementOptions,
      StripePaymentElementOptions
    } from '@stripe/stripe-js';

    import { YourOwnAPIService } from './your-own-api.service';

    @Component({
      selector: 'ngstr-checkout-form',
      templateUrl: './address-element.component.html',
      standalone: true,
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        StripeElementsDirective,
        StripeLinkAuthenticationComponent,
        StripeAddressComponent,
        StripePaymentElementComponent
      ]
    })
    export class CheckoutFormComponent implements OnInit {
      private readonly fb = inject(UntypedFormBuilder);
      private readonly yourOwnAPI = inject(YourOwnAPIService);

      addressElementForm = this.fb.group({
        name: ['John doe', [Validators.required]],
        amount: [2500, [Validators.required, Validators.pattern(/\d+/)]]
      });

      elementsOptions: StripeElementsOptions = {
        locale: 'en',
        appearance: {
          theme: 'flat'
        },
      };

      linkOptions: StripeLinkAuthenticationElementOptions = {
        defaultValues: {
          email: 'support@ngx-stripe.dev'
        }
      };

      shippingAddressOptions: StripeAddressElementOptions = {
        mode: 'shipping'
      };

      billingAddressOptions: StripeAddressElementOptions = {
        mode: 'billing'
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
            amount: this.addressElementForm.get('amount').value,
            currency: 'usd'
          })
          .subscribe(pi => {
            this.elementsOptions.clientSecret = pi.client_secret as string;
          });
      }

      pay() {
        if (this.paying() || this.paymentElementForm.invalid) return;
        this.paying.set(true);

        const { name } = this.addressElementForm.getRawValue();

        this.stripe
          .confirmPayment({
            elements: this.paymentElement.elements,
            confirmParams: {
              payment_method_data: {
                billing_details: {
                  // notice how much of the information is handled by Stripe
                  name: this.stripeTest.get('name').value
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
}