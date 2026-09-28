import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import {
  StripePaymentElementComponent,
  injectStripe,
  StripeElementsDirective
} from 'ngx-stripe';
import { StripeElementsOptions } from '@stripe/stripe-js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, StripeElementsDirective, StripePaymentElementComponent],
  template: `
    <h1>ngx-stripe Payment Element</h1>
    <p class="meta">Minimal playground — Stripe <strong>test</strong> key only. Create a PaymentIntent on your server before confirm.</p>
    <div [formGroup]="checkout">
      <ngx-stripe-elements [stripe]="stripe" [elementsOptions]="elementsOptions">
        <ngx-stripe-payment />
      </ngx-stripe-elements>
      <button type="button" (click)="pay()" [disabled]="paying()">Pay (needs clientSecret)</button>
    </div>
    @if (message()) {
    <p>{{ message() }}</p>
    }
  `
})
export class AppComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  readonly stripe = injectStripe();
  readonly paying = signal(false);
  readonly message = signal('');

  readonly checkout = this.fb.group({
    name: ['ngx-stripe playground', [Validators.required]]
  });

  /** Deferred intent mode — mounts without a backend clientSecret. */
  readonly elementsOptions: StripeElementsOptions = {
    locale: 'en',
    mode: 'payment',
    amount: 1099,
    currency: 'usd',
    appearance: { theme: 'stripe' }
  };

  pay(): void {
    this.message.set(
      'This playground mounts the Payment Element. Wire a PaymentIntent clientSecret to elementsOptions to confirm.'
    );
  }
}
