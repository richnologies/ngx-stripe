import { Component } from '@angular/core';

import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';

import {
  NgStrCodeComponent,
  NgStrCodeGroupComponent,
  NgStrDocsHeaderComponent,
  NgStrHighlightComponent,
  NgStrLinkComponent,
  NgStrPanelComponent,
  NgStrSectionComponent,
  NgStrSubheaderComponent,
  NgStrContainerComponent,
  NgStrBadgeComponent
} from '../../docs-elements';

@Component({
  selector: 'ngstr-link-authentication',
  templateUrl: './link-authentication.component.html',
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
export default class NgStrLinkAuthenticationComponent {
  linkAuthTS = `
    import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
    import { UntypedFormBuilder, Validators } from '@angular/forms';

    import { MatInputModule } from '@angular/material/input';

    import {
      injectStripe,
      StripeElementsDirective,
      StripePaymentElementComponent,
      StripeLinkAuthenticationComponent
    } from 'ngx-stripe';
    import {
      StripeElementsOptions, 
      StripePaymentElementOptions,
      StripeLinkAuthenticationElementOptions
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
        StripePaymentElementComponent,
        StripeLinkAuthenticationComponent
      ]
    })
    export class CheckoutFormComponent implements OnInit {
      @ViewChild(StripePaymentElementComponent)
      paymentElement!: StripePaymentElementComponent;
      @ViewChild(StripeLinkAuthenticationComponent)
      linkElement!: StripeLinkAuthenticationComponent;

      private readonly fb = inject(UntypedFormBuilder);
      private readonly yourOwnAPI = inject(YourOwnAPIService);

      paymentElementForm = this.fb.group({
        name: ['John doe', [Validators.required]],
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

      linkOptions: StripeLinkAuthenticationElementOptions = {
        defaultValues: {
          email: 'support@ngx-stripe.dev'
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

        const { name, address, zipcode, city } = this.checkoutForm.getRawValue();

        this.stripe
          .confirmPayment({
            elements: this.paymentElement.elements,
            confirmParams: {
              payment_method_data: {
                billing_details: {
                  name: name as string,
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

  linkAuthHTML = `
    <div [formGroup]="paymentElementForm">
      <mat-form-field class="example-full-width" appearance="fill">
        <input matInput placeholder="name" formControlName="name" />
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
          <h3>Contact Info</h3>
          <ngx-stripe-link-authentication [options]="linkOptions" />

          <h3>Payment</h3>
          <ngx-stripe-payment [options]="paymentElementOptions" />
        </ngx-stripe-elements>
      }
      <button (click)="pay()">PAY</button>
    </div>
  `;

  linkAuthChangeTS = `
    import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
    import { UntypedFormBuilder, Validators } from '@angular/forms';

    import { MatInputModule } from '@angular/material/input';

    import {
      injectStripe,
      StripeElementsDirective,
      StripePaymentElementComponent
    } from 'ngx-stripe';
    import {
      StripeElementsOptions, 
      StripePaymentElementOptions,
      StripeLinkAuthenticationElementOptions,
      StripeLinkAuthenticationElementChangeEvent
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
        StripePaymentElementComponent,
        StripeLinkAuthenticationComponent
      ]
    })
    export class CheckoutFormComponent implements OnInit {
      @ViewChild(StripePaymentElementComponent)
      paymentElement!: StripePaymentElementComponent;
      @ViewChild(StripeLinkAuthenticationComponent)
      linkElement!: StripeLinkAuthenticationComponent;

      private readonly fb = inject(UntypedFormBuilder);
      private readonly yourOwnAPI = inject(YourOwnAPIService);

      paymentElementForm = this.fb.group({
        name: ['John doe', [Validators.required]],
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

      linkOptions: StripeLinkAuthenticationElementOptions = {
        defaultValues: {
          email: 'support@ngx-stripe.dev'
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

      onChange(ev: StripeLinkAuthenticationElementChangeEvent) {
        const email = event.value.email;
      }

      pay() {
        // ...
      }
    }
  `;

  linkAuthChangeHTML = `
    <div [formGroup]="paymentElementForm">
      <mat-form-field class="example-full-width" appearance="fill">
        <input matInput placeholder="name" formControlName="name" />
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
          <h3>Contact Info</h3>
          <ngx-stripe-link-authentication [options]="linkOptions" (change)="onChange($event)" />

          <h3>Payment</h3>
          <ngx-stripe-payment [options]="paymentElementOptions" />
        </ngx-stripe-elements>
      }
      <button (click)="pay()">PAY</button>
    </div>
  `;
}