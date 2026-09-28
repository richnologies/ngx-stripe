export type FirstPaymentPath = 'payment' | 'card';

export interface FirstPaymentSnippet {
  name: string;
  code: string;
}

export interface FirstPaymentWelcomeSlide {
  id: string;
  title: string;
  blurb: string;
  /** When set, shows path picker instead of a code panel */
  fork?: boolean;
  fileName?: string;
  /** Static snippet, or path-keyed for slides that depend on PE vs Card */
  snippet?: string | Record<FirstPaymentPath, string>;
}

export interface FirstPaymentTourStep {
  id: string;
  title: string;
  summary: string;
  body: string[];
  /** Steps that only appear after a path is chosen */
  path?: FirstPaymentPath | 'any';
  /** Show the Payment Element / Card picker on this step */
  pickPath?: boolean;
  /** Final step: embed a live test checkout for this path */
  demo?: FirstPaymentPath;
  snippets?: FirstPaymentSnippet[];
  links?: { label: string; path: string }[];
}

export const FIRST_PAYMENT_PROVIDE = `import { ApplicationConfig } from '@angular/core';
import { provideNgxStripe } from 'ngx-stripe';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNgxStripe('pk_test_…'),
  ]
};`;

export const FIRST_PAYMENT_BOOTSTRAP = `import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));`;

/** Single-panel welcome snippet: config + where it is passed at bootstrap */
export const FIRST_PAYMENT_PROVIDE_WELCOME = `import { ApplicationConfig } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideNgxStripe } from 'ngx-stripe';

import { AppComponent } from './app/app.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNgxStripe('pk_test_…'),
  ]
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));`;

export const FIRST_PAYMENT_ELEMENTS_TS = `import { Component } from '@angular/core';
import { StripeElementsOptions } from '@stripe/stripe-js';
import {
  injectStripe,
  StripeElementsDirective,
  StripePaymentElementComponent
} from 'ngx-stripe';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [StripeElementsDirective, StripePaymentElementComponent],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent {
  stripe = injectStripe();

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
    // clientSecret from your server (PaymentIntent / SetupIntent)
    clientSecret: '{{CLIENT_SECRET}}',
    appearance: { theme: 'stripe' }
  };
}`;

export const FIRST_PAYMENT_ELEMENTS_HTML = `<ngx-stripe-elements
  [stripe]="stripe"
  [elementsOptions]="elementsOptions"
>
  <!-- Payment Element or Card Element -->
</ngx-stripe-elements>`;

export const FIRST_PAYMENT_PE_HTML = `<form [formGroup]="checkoutForm" (ngSubmit)="pay()">
  <input formControlName="name" placeholder="Name" />
  <input formControlName="email" type="email" placeholder="Email" />

  @if (elementsOptions.clientSecret) {
    <ngx-stripe-elements
      [stripe]="stripe"
      [elementsOptions]="elementsOptions"
    >
      <ngx-stripe-payment />
    </ngx-stripe-elements>
  }

  <button type="submit" [disabled]="paying">Pay</button>
</form>`;

export const FIRST_PAYMENT_PE_TS = `import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { StripeElementsOptions } from '@stripe/stripe-js';
import {
  injectStripe,
  StripeElementsDirective,
  StripePaymentElementComponent
} from 'ngx-stripe';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    StripeElementsDirective,
    StripePaymentElementComponent
  ],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {
  @ViewChild(StripePaymentElementComponent)
  paymentElement!: StripePaymentElementComponent;

  private readonly fb = inject(FormBuilder);

  stripe = injectStripe();
  paying = false;

  checkoutForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
    appearance: { theme: 'stripe' }
  };

  ngOnInit() {
    // Fetch a PaymentIntent clientSecret from your backend, then:
    // this.elementsOptions = { ...this.elementsOptions, clientSecret };
  }

  pay() {
    if (this.checkoutForm.invalid) return;
    this.paying = true;

    this.stripe
      .confirmPayment({
        elements: this.paymentElement.elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: this.checkoutForm.value.name!,
              email: this.checkoutForm.value.email!
            }
          }
        },
        redirect: 'if_required'
      })
      .subscribe({
        next: (result) => {
          this.paying = false;
          if (result.error) {
            console.error(result.error.message);
            return;
          }
          if (result.paymentIntent?.status === 'succeeded') {
            // Success
          }
        },
        error: () => {
          this.paying = false;
        }
      });
  }
}`;

export const FIRST_PAYMENT_CARD_HTML = `<form [formGroup]="checkoutForm" (ngSubmit)="pay()">
  <input formControlName="name" placeholder="Name" />

  <ngx-stripe-elements
    [stripe]="stripe"
    [elementsOptions]="elementsOptions"
  >
    <ngx-stripe-card [options]="cardOptions" />
  </ngx-stripe-elements>

  <button type="submit" [disabled]="paying">Pay</button>
</form>`;

export const FIRST_PAYMENT_CARD_TS = `import { Component, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';
import {
  injectStripe,
  StripeCardComponent,
  StripeElementsDirective
} from 'ngx-stripe';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    StripeElementsDirective,
    StripeCardComponent
  ],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent {
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;

  private readonly fb = inject(FormBuilder);

  stripe = injectStripe();
  paying = false;

  checkoutForm = this.fb.group({
    name: ['', Validators.required]
  });

  elementsOptions: StripeElementsOptions = { locale: 'en' };

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#0b1220',
        '::placeholder': { color: '#94a3b8' }
      }
    }
  };

  pay() {
    if (this.checkoutForm.invalid) return;
    this.paying = true;

    // Create a PaymentIntent on your server, then confirm with the card Element
    this.createPaymentIntent({ amount: 2500, currency: 'usd' })
      .pipe(
        switchMap((pi) =>
          this.stripe.confirmCardPayment(pi.client_secret, {
            payment_method: {
              card: this.card.element,
              billing_details: { name: this.checkoutForm.value.name! }
            }
          })
        )
      )
      .subscribe({
        next: (result) => {
          this.paying = false;
          if (result.error) {
            console.error(result.error.message);
            return;
          }
          if (result.paymentIntent?.status === 'succeeded') {
            // Success
          }
        },
        error: () => {
          this.paying = false;
        }
      });
  }

  // Your API — returns { client_secret }
  private createPaymentIntent(_body: { amount: number; currency: string }) {
    // return this.http.post<{ client_secret: string }>('/api/create-payment-intent', _body);
    throw new Error('Wire this to your backend');
  }
}`;

export const FIRST_PAYMENT_CONFIRM_PE = `@ViewChild(StripePaymentElementComponent)
paymentElement!: StripePaymentElementComponent;

pay() {
  this.paying = true;

  this.stripe
    .confirmPayment({
      elements: this.paymentElement.elements,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name: this.checkoutForm.value.name!,
            email: this.checkoutForm.value.email!
          }
        }
      },
      redirect: 'if_required'
    })
    .subscribe((result) => {
      this.paying = false;
      if (result.error) {
        // Show error to your customer
        return;
      }
      if (result.paymentIntent?.status === 'succeeded') {
        // Payment succeeded
      }
    });
}`;

export const FIRST_PAYMENT_CONFIRM_CARD = `@ViewChild(StripeCardComponent)
card!: StripeCardComponent;

pay() {
  this.paying = true;

  // clientSecret from your server (PaymentIntent)
  this.stripe
    .confirmCardPayment(clientSecret, {
      payment_method: {
        card: this.card.element,
        billing_details: { name: this.checkoutForm.value.name! }
      }
    })
    .subscribe((result) => {
      this.paying = false;
      if (result.error) {
        // Show error to your customer
        return;
      }
      if (result.paymentIntent?.status === 'succeeded') {
        // Payment succeeded
      }
    });
}`;

/** Snappy slides for the welcome carousel */
export const FIRST_PAYMENT_WELCOME_SLIDES: FirstPaymentWelcomeSlide[] = [
  {
    id: 'provide',
    title: 'Provide ngx-stripe',
    blurb: 'Register Stripe in your app config providers, then pass that config into bootstrapApplication.',
    fileName: 'main.ts',
    snippet: FIRST_PAYMENT_PROVIDE_WELCOME
  },
  {
    id: 'elements',
    title: 'Create Elements',
    blurb: 'Wrap child Elements in ngx-stripe-elements — the shared Stripe Elements context.',
    fileName: 'checkout.component.html',
    snippet: FIRST_PAYMENT_ELEMENTS_HTML
  },
  {
    id: 'pick',
    title: 'Choose Payment or Card',
    blurb: 'Payment Element covers cards and wallets in one UI. Card Element is the classic single-field card input.',
    fork: true
  },
  {
    id: 'mount',
    title: 'Drop the Element',
    blurb: 'Mount your chosen Element inside the Elements container and bind options from the component.',
    fileName: 'checkout.component.html',
    snippet: {
      payment: FIRST_PAYMENT_PE_HTML,
      card: FIRST_PAYMENT_CARD_HTML
    }
  },
  {
    id: 'confirm',
    title: 'Confirm the payment',
    blurb: 'Your server creates a PaymentIntent; the client confirms it with Stripe through ngx-stripe.',
    fileName: 'checkout.component.ts',
    snippet: {
      payment: FIRST_PAYMENT_CONFIRM_PE,
      card: FIRST_PAYMENT_CONFIRM_CARD
    }
  }
];

/** Full docs guided-tour steps (path-aware after pick) */
export const FIRST_PAYMENT_TOUR_STEPS: FirstPaymentTourStep[] = [
  {
    id: 'provide',
    title: 'Provide ngx-stripe',
    summary: 'Install peers and register Stripe in your standalone app config.',
    body: [
      'Add ngx-stripe and @stripe/stripe-js that match your Angular major and Stripe.js lane.',
      'Put provideNgxStripe() in your ApplicationConfig providers, then pass that config to bootstrapApplication.',
      'Never put secret keys in the browser — only pk_test_ / pk_live_.'
    ],
    path: 'any',
    snippets: [{ name: 'main.ts', code: FIRST_PAYMENT_PROVIDE_WELCOME }],
    links: [
      { label: 'Installation', path: '/docs/installation' },
      { label: 'Setup Application', path: '/docs/setup-application' }
    ]
  },
  {
    id: 'elements',
    title: 'Stripe Elements container',
    summary: 'Elements is the parent context every Stripe Element mounts into.',
    body: [
      'Use ngx-stripe-elements (StripeElementsDirective) and pass a Stripe instance plus StripeElementsOptions.',
      'For Payment Element flows you typically set clientSecret from a PaymentIntent or SetupIntent created on your server. Locale and appearance live on the same options object.',
      'Prefer the Elements directive over the older implicit Elements API — implicit mode is deprecated and kept for compatibility only.'
    ],
    path: 'any',
    snippets: [
      { name: 'checkout.component.ts', code: FIRST_PAYMENT_ELEMENTS_TS },
      { name: 'checkout.component.html', code: FIRST_PAYMENT_ELEMENTS_HTML }
    ],
    links: [{ label: 'Elements reference', path: '/docs/elements' }]
  },
  {
    id: 'pick',
    title: 'Pick your Element',
    summary: 'Choose Payment Element or classic Card Element for the rest of this tour.',
    body: [
      'Payment Element is Stripe’s recommended embeddable UI — cards, wallets, and local methods from one component.',
      'Card Element is the classic single card field (or split number / expiry / CVC). Still fully supported with ngx-stripe.',
      'Your choice only changes the mount and confirm snippets below — provide and Elements stay the same.'
    ],
    path: 'any',
    pickPath: true,
    links: [
      { label: 'Payment Element', path: '/docs/payment-element' },
      { label: 'Card Elements', path: '/docs/card-elements' }
    ]
  },
  {
    id: 'wire-payment',
    title: 'Wire Payment Element',
    summary: 'Mount ngx-stripe-payment and confirm with confirmPayment.',
    body: [
      'Place ngx-stripe-payment inside ngx-stripe-elements once you have a clientSecret.',
      'Hold a ViewChild of StripePaymentElementComponent so you can pass paymentElement.elements into confirmPayment.',
      'Your backend still owns creating the PaymentIntent — the browser only confirms it.'
    ],
    path: 'payment',
    snippets: [
      { name: 'checkout.component.html', code: FIRST_PAYMENT_PE_HTML },
      { name: 'checkout.component.ts', code: FIRST_PAYMENT_PE_TS }
    ],
    links: [{ label: 'Payment Element docs', path: '/docs/payment-element' }]
  },
  {
    id: 'wire-card',
    title: 'Wire Card Element',
    summary: 'Mount ngx-stripe-card and confirm with confirmCardPayment.',
    body: [
      'Place ngx-stripe-card inside ngx-stripe-elements. Style via StripeCardElementOptions.',
      'Create a PaymentIntent on your server, then call confirmCardPayment with the card Element and billing details.',
      'Split card fields (number / expiry / CVC) are also available if you need a custom layout.'
    ],
    path: 'card',
    snippets: [
      { name: 'checkout.component.html', code: FIRST_PAYMENT_CARD_HTML },
      { name: 'checkout.component.ts', code: FIRST_PAYMENT_CARD_TS }
    ],
    links: [{ label: 'Card Elements docs', path: '/docs/card-elements' }]
  },
  {
    id: 'confirm-payment',
    title: 'Confirm with Payment Element',
    summary: 'confirmPayment completes the Intent using the Elements instance.',
    body: [
      'Pass elements from the Payment Element component and optional billing_details.',
      'Use redirect: "if_required" when you want to stay on-page for cards that do not need a redirect.',
      'Always handle result.error and check paymentIntent.status for succeeded.'
    ],
    path: 'payment',
    snippets: [{ name: 'checkout.component.ts', code: FIRST_PAYMENT_CONFIRM_PE }],
    links: [{ label: 'StripeService API', path: '/docs/service' }]
  },
  {
    id: 'confirm-card',
    title: 'Confirm with Card Element',
    summary: 'confirmCardPayment attaches the card Element to your PaymentIntent.',
    body: [
      'Fetch client_secret from your server first, then confirm with the card Element reference.',
      'Billing details and other payment_method fields go on the confirm call.',
      'Handle errors and succeeded status the same way as other PaymentIntent flows.'
    ],
    path: 'card',
    snippets: [{ name: 'checkout.component.ts', code: FIRST_PAYMENT_CONFIRM_CARD }],
    links: [{ label: 'StripeService API', path: '/docs/service' }]
  },
  {
    id: 'demo-payment',
    title: 'Try a live demo',
    summary: 'Confirm a test PaymentIntent with Payment Element — no local setup.',
    body: [
      'Use Stripe test card 4242 4242 4242 4242, any future expiry, and any CVC.',
      'This demo creates a PaymentIntent on our test backend, then confirms it through ngx-stripe.',
      'When you ship, point the same confirmPayment flow at your own server.'
    ],
    path: 'payment',
    demo: 'payment',
    links: [
      { label: 'Payment Element reference', path: '/docs/payment-element' },
      { label: 'More examples', path: '/docs/examples' }
    ]
  },
  {
    id: 'demo-card',
    title: 'Try a live demo',
    summary: 'Confirm a test PaymentIntent with Card Element — no local setup.',
    body: [
      'Use Stripe test card 4242 4242 4242 4242, any future expiry, and any CVC.',
      'This demo creates a PaymentIntent on our test backend, then confirms it through ngx-stripe.',
      'When you ship, point the same confirmCardPayment flow at your own server.'
    ],
    path: 'card',
    demo: 'card',
    links: [
      { label: 'Card Elements reference', path: '/docs/card-elements' },
      { label: 'More examples', path: '/docs/examples' }
    ]
  }
];

export function welcomeSnippetFor(
  slide: FirstPaymentWelcomeSlide,
  path: FirstPaymentPath
): string | null {
  if (!slide.snippet) return null;
  if (typeof slide.snippet === 'string') return slide.snippet;
  return slide.snippet[path];
}

export function tourStepsFor(path: FirstPaymentPath | null): FirstPaymentTourStep[] {
  return FIRST_PAYMENT_TOUR_STEPS.filter((step) => {
    if (step.path === 'any' || step.path == null) return true;
    if (!path) return false;
    return step.path === path;
  });
}
