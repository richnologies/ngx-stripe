An Angular 6+ wrapper for StripeJS elements

[![version](https://img.shields.io/npm/v/ngx-stripe.svg)](https://www.npmjs.com/package/ngx-stripe)
[![license](https://img.shields.io/npm/l/express.svg)](https://www.npmjs.com/package/ngx-stripe)

<h1 align="center">
  <img width="40" valign="bottom" src="https://angular.io/assets/images/logos/angular/angular.svg">
  ngx-stripe
</h1>

Ngx Stripe is a thin wrapper around [`Stripe Elements`](https://stripe.com/docs/stripe-js). It allows adding Elements to any Angular app.
The [`StripeJS Reference`](https://stripe.com/docs/js) covers complete Elements customization details.
You can use Elements with any Stripe product to collect online payments. To find the right integration path for your business, explore [`Stripe Docs`](https://stripe.com/docs/stripe-js).

- Learn how to use `ngx-stripe` on the **new** [docs site](https://richnologies.gitbook.io/ngx-stripe/) 🤓

## Notice

This project has not been updated for a while. After reviewing the state of the art for React and Vue counterparts, some major changes are going to be introduced to align this project with [`Stripe Elements`](https://stripe.com/docs/stripe-js).

1. `ngx-stripe` will no longer maintain its own interfaces. Instead, `@stripe/stripe-js` has been added as peer dependency. This will make the library easier to maintain and avoid mistakes.
2. [`Stripe Service`](https://stripe.com/docs/js) has been updated with all the missing APIs from StripeJS
3. All the missing [`Element Components`](https://stripe.com/docs/stripe-js/react#element-components) like IBAN, Ideal, FPX, ... have been added
4. `Request Payment Button` now has full support
5. Added [`Container Style`](https://stripe.com/docs/js/element/the_element_container) functionality support
6. A [`Migration`](https://github.com/richnologies/ngx-stripe/blob/main/MIGRATION.md) guide has been added with details of what have changed
7. The new version of library is compatible from Angular 6+ major versions. Check the `Installation` section to see how to install an older version.
8. All documentation has been moved to a new [docs site](https://richnologies.gitbook.io/ngx-stripe/)

In order to ease the transition, we are naming the old version of the library `legacy` and we have created some `npm tags` to make it easy to install older versions.

Finally, we are aware this library has been abandon for many months. A new **SLA** has been stablish, so we will try to answer any open issues within the week.

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
| 10      | **Not Available**   | 10.x+             |
| 9       | v9-legacy / 9.0.x+  | v9-lts / 9.1.x+   |
| 8       | v8-legacy / 7.4.4+  | v8-lts / 8.1.x+   |
| 7       | v7-legacy / 7.x+    | v7-lts / 7.5.x+   |
| 6       | v6-legacy / 0.6.x   | v6-lts / 6.1.x+   |
| 5       | 0.5.x or less       | **Not Available** |
| 4       | 0.4.x or less       | **Not Available** |

---

## Using the library

Most of the documentation has been moved to a new [docs site](https://richnologies.gitbook.io/ngx-stripe/). Only a very basic example has been left here:

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

Please check the [docs site](https://richnologies.gitbook.io/ngx-stripe/) to see a complete set of Stripe Element Components available and the full API of the Stripe Service.

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
  selector: 'app-create-token',
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

## License

MIT © [Ricardo Sánchez Gregorio](mailto:me@richnologies.io)
