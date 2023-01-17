An Angular 6+ wrapper for StripeJS elements

<a href="https://stripe.com/partners/ngx-stripe" target="_blank"><img src="./docs/logos/stripe_partner_badge_verified_blurple.png" alt="drawing" width="98"/>
[![version](https://img.shields.io/npm/v/ngx-stripe.svg)](https://www.npmjs.com/package/ngx-stripe)
[![license](https://img.shields.io/npm/l/express.svg)](https://www.npmjs.com/package/ngx-stripe)

<h1 align="center">
  <img width="160" valign="bottom" src="./docs/logos/ngx-stripe-logo.png">
</h1>

Ngx Stripe is a thin wrapper around [`Stripe Elements`](https://stripe.com/docs/stripe-js). It allows adding Elements to any Angular app.
The [`StripeJS Reference`](https://stripe.com/docs/js) covers complete Elements customization details.
You can use Elements with any Stripe product to collect online payments. To find the right integration path for your business, explore [`Stripe Docs`](https://stripe.com/docs/stripe-js).

- Learn how to use `ngx-stripe` on the **new** [docs site](https://ngx-stripe.dev/docs) 🤓

## Notice

After reviewing the state of the art for React and Vue counterparts, some major changes are going to be introduced to align this project with [`Stripe Elements`](https://stripe.com/docs/stripe-js).

1. `ngx-stripe` will no longer maintain its own interfaces. Instead, `@stripe/stripe-js` has been added as peer dependency. This will make the library easier to maintain and avoid mistakes.
2. [`Stripe Service`](https://stripe.com/docs/js) has been updated with all the missing APIs from StripeJS
3. All the missing [`Element Components`](https://stripe.com/docs/stripe-js/react#element-components) like IBAN, Ideal, FPX, ... have been added
4. `Request Payment Button` now has full support
5. Added [`Container Style`](https://stripe.com/docs/js/element/the_element_container) functionality support
6. A [`Migration`](https://github.com/richnologies/ngx-stripe/blob/main/MIGRATION.md) guide has been added with details of what have changed
7. The new version of library is compatible from Angular 6+ major versions. Check the `Installation` section to see how to install an older version.
8. All documentation has been moved to a new [docs site](https://ngx-stripe.dev/docs)

In order to ease the transition, we are naming the old version of the library `legacy` and we have created some `npm tags` to make it easy to install older versions.

## Features

- Lazy script loading
- Element Components
- Stripe Observable wrapper

## Installation

**Active Versions**

To install the last active version:

```bash
$ npm install ngx-stripe @stripe/stripe-js
```

To install an specific version for an older Angular major, use the lts npm tags or check the table below to pick the right version, for example, for v8:

```bash
$ npm install ngx-stripe@v8-lts @stripe/stripe-js
```

**Legacy Versions**

To install some of the older versions of the library use the legacy npm tags or check the table below to pick the right version, for example, for v7:

```bash
$ npm install ngx-stripe@v7-legacy
```

Choose the version corresponding to your Angular version:

| Angular | ngx-stripe (legacy) | ngx-stripe        |
| ------- | ------------------- | ----------------- |
| 15      | **Not Available**   | 15.x+             |
| 14      | **Not Available**   | 14.x+             |
| 13      | **Not Available**   | 13.x+             |
| 12      | **Not Available**   | 12.x+             |
| 11      | **Not Available**   | 11.x+             |
| 10      | **Not Available**   | 10.x+             |
| 9       | v9-legacy / 9.0.x+  | v9-lts / 9.1.x+   |
| 8       | v8-legacy / 7.4.4+  | v8-lts / 8.1.x+   |
| 7       | v7-legacy / 7.x+    | v7-lts / 7.5.x+   |
| 6       | v6-legacy / 0.6.x   | v6-lts / 6.1.x+   |
| 5       | 0.5.x or less       | **Not Available** |
| 4       | 0.4.x or less       | **Not Available** |

---

## Using the library

Most of the documentation has been moved to a new [docs site](https://ngx-stripe.dev/docs). Only a very basic example has been left here:

Import the `NgxStripeModule` into your application

The module takes the same parameters as the global Stripe object. The `APIKey` and the optional options to use Stripe connect

- apiKey: string
- options?: {
  stripeAccount?: string;
  }

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import the library
import { NgxStripeModule } from 'ngx-stripe';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NgxStripeModule.forRoot('***your-stripe-publishable-key***'),
    LibraryModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

## Card Element Component

Once the module has been imported, you can collect credit card details using the ngx-stripe-card component.

Then you can use the Stripe Service, which is basically an Obseravble wrapper around the stripejs object, to use that information. In this example we use it to create a token, but it can be use to confirm a Payment Intent, Setup Intent, etc...

Please check the [docs site](https://ngx-stripe.dev/docs) to see a complete set of Stripe Element Components available and the full API of the Stripe Service.

// stripe.html

```xml
<form novalidate (ngSubmit)="createToken()" [formGroup]="stripeTest">
  <input type="text" formControlName="name" placeholder="Jane Doe">
  <ngx-stripe-card
    [options]="cardOptions"
    [elementsOptions]="elementsOptions"
  ></ngx-stripe-card>
  <button type="submit">
    CREATE TOKEN
  </button>
</form>
```

```typescript
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';

@Component({
  selector: 'ngstr-create-token',
  templateUrl: 'stripe.html'
})
export class StripeCreateTokenComponent implements OnInit {
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
    locale: 'es'
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
```

## Support us

`ngx-stripe` is an MIT-licensed open source project. You can now become a sponsor with [GitHub Sponsors](https://github.com/sponsors/richnologies).

We've been bringing `ngx-stripe` to the world for over 4 years and are excited to be able to start dedicating some real resources to the project.

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
