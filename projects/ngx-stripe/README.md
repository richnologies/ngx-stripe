Collect Payments with Stripe: The Angular Way

<a href="https://stripe.com/partners/ngx-stripe" target="_blank"><img src="./docs/logos/stripe_partner_badge_verified_blurple.png" alt="drawing" width="98"/>
[![version](https://img.shields.io/npm/v/ngx-stripe.svg)](https://www.npmjs.com/package/ngx-stripe)
[![license](https://img.shields.io/npm/l/express.svg)](https://www.npmjs.com/package/ngx-stripe)

<h1 align="center">
  <img width="160" valign="bottom" src="./docs/logos/ngx-stripe-logo.png">
</h1>

Ngx Stripe is a comprehensive library designed for seamless integration of [`Stripe Elements`](https://stripe.com/docs/stripe-js) and payment processing capabilities into Angular applications. Leveraging the powerful features of [`StripeJS`](https://stripe.com/docs/js), Ngx Stripe simplifies building robust, secure, and scalable payment solutions.

Use Elements with any Stripe product to collect online payments. For the right integration path for your business, explore the [`Stripe Docs`](https://stripe.com/docs/stripe-js).

Learn how to use `ngx-stripe` on the **new** [docs site](https://ngx-stripe.dev/docs) 🤓

## Notice (Feb 13th 2024)

We would like to inform you that we have updated the library to support Stripe V3 from version 17.1.0 onwards. This is a major version upgrade, but it's not a significant change and should not cause any issues. 

We are keeping the library versioning in line with Angular majors, which upgrade more often than Stripe, and as a result, we are deviating from the semver standard. We believe this approach will provide a better experience in the long run.

We would like to apologize for any inconvenience this may cause you.

## Features

- **Angular Components for Stripe Elements**: Ngx Stripe provides a set of Angular components, each corresponding to a specific Stripe Web Element. These components are designed to simplify the integration of Stripe's UI elements, ensuring a smooth and consistent user experience.
- **Seamless Integration with StripeJS**: Aligning closely with StripeJS, Ngx Stripe ensures that you have access to the latest features and updates from Stripe, directly within your Angular application.
- **Lazy Loading of StripeJS**: Enhance your application's performance by lazy loading the StripeJS JavaScript. This feature ensures that the StripeJS library is loaded only when needed, optimizing loading times and improving the overall user experience.
- **Customizable and Flexible**: Customize the look and feel of your payment forms to match your application's design. Ngx Stripe components are highly flexible, allowing for extensive customization and styling.
- **Strongly Typed for Angular Development**: Benefit from TypeScript in your payment integration. Ngx Stripe is strongly typed, making 

## Installation

**Active Versions**

To install the last active version:

```bash
$ npm install ngx-stripe @stripe/stripe-js
```

To install a specific version for an older Angular major, use the LTS npm tags or check the table below to pick the right version. For example, for v8:

```bash
$ npm install ngx-stripe@v14-lts @stripe/stripe-js
```

Choose the version corresponding to your Angular version:

| Angular | ngx-stripe        |
| ------- | ----------------- |
| 17      | 17.x+             |
| 16      | 16.x+             |
| 15      | 15.x+             |
| 14      | 14.x+             |
| 13      | 13.x+             |
| 12      | 12.x+             |
| 11      | 11.x+             |
| 10      | 10.x+             |
| 9       | v9-lts / 9.4.0    |
| 8       | v8-lts / 8.2.0    |

---

## Using the library

Most of the documentation has been moved to the new [docs site](https://ngx-stripe.dev/docs). Only a very basic example is left here:

We start by adding the providers to our app:

```ts
import { provideNgxStripe } from 'ngx-stripe';

bootstrapApplication(AppComponent, {
  providers: [
    // ... rest of your providers
    provideNgxStripe()
  ]
});
```

Or if you're still using modules:

Import the `NgxStripeModule` into your application:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import the library
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import the library
import { NgxStripeModule } from 'ngx-stripe';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    // ... rest of your imports
    NgxStripeModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

```

## Payment Element Component

Once the module has been imported, you can collect credit card details using the ngx-stripe-card component.

Then you can use the Stripe Service, which is basically an Observable wrapper around the stripejs object, to use that information. In this example, we use it to create a token, but it can be used to confirm a Payment Intent, Setup Intent, etc...

Please check the [docs site](https://ngx-stripe.dev/docs) to see a complete set of Stripe Element Components available and the full API of the Stripe Service.

```xml
<div [formGroup]="paymentElementForm">
  <mat-form-field appearance="fill">
    <input matInput placeholder="name" formControlName="name" />
  </mat-form-field>
  <mat-form-field appearance="fill">
    <input matInput placeholder="Email" type="email" formControlName="email" />
  </mat-form-field>
  <mat-form-field appearance="fill">
    <input matInput placeholder="Address" formControlName="address" />
  </mat-form-field>
  <mat-form-field appearance="fill">
    <input matInput placeholder="ZIP Code" formControlName="zipcode" />
  </mat-form-field>
  <mat-form-field appearance="fill">
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
```

```typescript
import { Component, inject, signal, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';

import {
  injectStripe,
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
    StripePaymentElementComponent
  ]
})
export class CheckoutFormComponent {
  @ViewChild(StripePaymentElementComponent)
  paymentElement!: StripePaymentElementComponent;

  private readonly fb = inject(UntypedFormBuilder);

  paymentElementForm = this.fb.group({
    name: ['John Doe', [Validators.required]],
    email: ['support@ngx-stripe.dev', [Validators.required]],
    address: [''],
    zipcode: [''],
    city: [''],
    amount: [2500, [Validators.required, Validators.pattern(/\d+/)]]
  });

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
    client: '{{YOUR_CLIENT_SECRET}}'
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

  // Replace with your own public key
  stripe = injectStripe({{YOUR_PUBLIC_KEY}});
  paying = signal(false);

  pay() {
    if (this.paying() || this.paymentElementForm.invalid) return;
    this.paying.set(true);

    const {
      name,
      email,
      address,
      zipcode,
      city
    } = this.checkoutForm.getRawValue();

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
```

## Support us

`ngx-stripe` is an MIT-licensed open source project. You can now become a sponsor with [GitHub Sponsors](https://github.com/sponsors/richnologies).

We've been bringing `ngx-stripe` to the world for over 6 years and are excited to be able to start dedicating some real resources to the project.

Your sponsorship helps us keep a team of maintainers actively working to improve `ngx-stripe` and ensure it stays up-to-date with the latest Stripe changes. If you're using `ngx-stripe` in a commercial capacity and have the ability to start a sponsorship, we'd greatly appreciate the contribution.

### Principal Sponsors

<p float="left">
  <a href="https://stripe.com" rel="nofollow noopener noreferrer" target="_blank">
    <img src="./docs/logos/stripe_blurple.png" width="210" />
  </a>
  <a href="https://www.psi-mobile.com" rel="nofollow noopener noreferrer" target="_blank">
    <img src="./docs/logos/psi-logo.png" width="170" />
  </a>
</p>

## License

MIT © [Ricardo Sánchez Gregorio](mailto:me@ricardosanchez.dev)
