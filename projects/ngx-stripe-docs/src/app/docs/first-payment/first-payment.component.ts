import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  computed,
  inject,
  signal
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {
  StripeCardComponent,
  StripeElementsDirective,
  StripePaymentElementComponent,
  injectStripe
} from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';

import { NgStrPlutoService } from '../../core';
import {
  NgStrCodeComponent,
  NgStrCodeGroupComponent,
  NgStrDocsHeaderComponent,
  NgStrHighlightComponent,
  NgStrSectionComponent
} from '../../docs-elements';

import {
  FirstPaymentPath,
  FirstPaymentTourStep,
  tourStepsFor
} from './first-payment.content';

@Component({
  selector: 'ngstr-first-payment',
  templateUrl: './first-payment.component.html',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    StripeElementsDirective,
    StripePaymentElementComponent,
    StripeCardComponent,
    NgStrCodeComponent,
    NgStrCodeGroupComponent,
    NgStrDocsHeaderComponent,
    NgStrHighlightComponent,
    NgStrSectionComponent
  ],
  styles: [
    `
      .ngst-tour-shell {
        border: 1px solid rgba(15, 23, 42, 0.08);
        background: rgba(255, 255, 255, 0.55);
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03), 0 12px 32px rgba(15, 23, 42, 0.05);
        overflow: hidden;
      }

      @media (min-width: 1024px) {
        .ngst-tour-shell {
          overflow: visible;
        }
      }

      .ngst-tour-rail-btn {
        border: 1px solid transparent;
        background: rgba(255, 255, 255, 0.72);
        backdrop-filter: blur(8px);
      }

      .ngst-tour-rail-btn-active {
        background: rgba(238, 237, 255, 0.95);
        border-color: rgba(99, 91, 255, 0.28);
        color: #0b1220;
      }

      .ngst-tour-pick {
        border: 1px solid rgba(15, 23, 42, 0.08);
        background: rgba(255, 255, 255, 0.65);
        transition:
          border-color 0.15s ease,
          box-shadow 0.15s ease,
          transform 0.15s ease;
      }

      .ngst-tour-pick:hover {
        border-color: rgba(99, 91, 255, 0.28);
        box-shadow: 0 10px 28px rgba(15, 23, 42, 0.06);
        transform: translateY(-1px);
      }

      .ngst-tour-pick-active {
        border-color: rgba(99, 91, 255, 0.4);
        background: rgba(99, 91, 255, 0.08);
        box-shadow: 0 10px 28px rgba(99, 91, 255, 0.1);
      }

      .ngst-tour-demo {
        border: 1px solid rgba(15, 23, 42, 0.08);
        background: #fff;
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 10px 28px rgba(15, 23, 42, 0.06);
      }

      .ngst-tour-demo-input {
        width: 100%;
        border-radius: 0.75rem;
        border: 1px solid rgba(15, 23, 42, 0.12);
        background: #fff;
        padding: 0.625rem 0.875rem;
        font-size: 0.875rem;
        color: #0b1220;
        outline: none;
      }

      .ngst-tour-demo-input:focus {
        border-color: rgba(99, 91, 255, 0.55);
        box-shadow: 0 0 0 3px rgba(99, 91, 255, 0.15);
      }
    `
  ]
})
export default class NgStrFirstPaymentComponent {
  @ViewChild(StripePaymentElementComponent)
  paymentElement?: StripePaymentElementComponent;

  @ViewChild(StripeCardComponent)
  cardElement?: StripeCardComponent;

  private readonly fb = inject(FormBuilder);
  private readonly pluto = inject(NgStrPlutoService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly selectedPath = signal<FirstPaymentPath | null>(null);
  readonly activeIndex = signal(0);

  readonly demoForm = this.fb.group({
    name: ['Jenny Rosen', Validators.required],
    email: ['jenny@example.com', [Validators.required, Validators.email]]
  });

  readonly stripe = injectStripe(this.pluto.KEYS.main);
  elementsOptions: StripeElementsOptions = {
    locale: 'en',
    appearance: { theme: 'stripe' }
  };

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#0b1220',
        '::placeholder': { color: '#94a3b8' }
      }
    }
  };

  readonly demoPaying = signal(false);
  readonly demoError = signal<string | null>(null);
  readonly demoSucceeded = signal(false);
  readonly demoReady = signal(false);
  private demoIntentRequested = false;
  private cardClientSecret: string | null = null;

  readonly steps = computed(() => tourStepsFor(this.selectedPath()));

  readonly step = computed(() => {
    const list = this.steps();
    const index = Math.min(this.activeIndex(), Math.max(list.length - 1, 0));
    return list[index] ?? null;
  });

  readonly isFirst = computed(() => this.activeIndex() === 0);
  readonly isLast = computed(() => {
    if (!this.selectedPath()) return false;
    return this.activeIndex() >= this.steps().length - 1;
  });

  goTo(index: number) {
    const max = this.steps().length - 1;
    if (index < 0 || index > max) return;
    this.activeIndex.set(index);
    this.primeDemoIfNeeded();
    this.scrollStepIntoView();
  }

  prev() {
    if (!this.isFirst()) {
      this.activeIndex.update((i) => i - 1);
      this.primeDemoIfNeeded();
      this.scrollStepIntoView();
    }
  }

  next() {
    const step = this.step();
    if (step?.pickPath && !this.selectedPath()) return;
    if (!this.isLast()) {
      this.activeIndex.update((i) => i + 1);
      this.primeDemoIfNeeded();
      this.scrollStepIntoView();
    }
  }

  selectPath(path: FirstPaymentPath) {
    const previousId = this.step()?.id;
    this.selectedPath.set(path);
    this.resetDemo();
    const nextSteps = tourStepsFor(path);
    const sameIdIndex = nextSteps.findIndex((s) => s.id === previousId);
    this.activeIndex.set(sameIdIndex >= 0 ? sameIdIndex : Math.min(this.activeIndex(), nextSteps.length - 1));
    this.primeDemoIfNeeded();
    this.scrollStepIntoView();
  }

  canAdvance(step: FirstPaymentTourStep | null): boolean {
    if (!step) return false;
    if (step.pickPath && !this.selectedPath()) return false;
    return true;
  }

  payDemo() {
    const mode = this.step()?.demo;
    if (!mode || this.demoForm.invalid || this.demoPaying()) return;

    this.demoPaying.set(true);
    this.demoError.set(null);

    if (mode === 'payment') {
      if (!this.paymentElement) {
        this.demoPaying.set(false);
        this.demoError.set('Payment Element is still loading.');
        return;
      }
      this.stripe
        .confirmPayment({
          elements: this.paymentElement.elements,
          confirmParams: {
            payment_method_data: {
              billing_details: {
                name: this.demoForm.value.name!,
                email: this.demoForm.value.email!
              }
            }
          },
          redirect: 'if_required'
        })
        .subscribe({
          next: (result) => {
            this.demoPaying.set(false);
            if (result.error) {
              this.demoError.set(result.error.message ?? 'Payment failed.');
              return;
            }
            if (result.paymentIntent?.status === 'succeeded') {
              this.demoSucceeded.set(true);
            }
          },
          error: () => {
            this.demoPaying.set(false);
            this.demoError.set('Something went wrong confirming the payment.');
          }
        });
      return;
    }

    if (!this.cardElement || !this.cardClientSecret) {
      this.demoPaying.set(false);
      this.demoError.set('Card Element is still loading.');
      return;
    }

    this.stripe
      .confirmCardPayment(this.cardClientSecret, {
        payment_method: {
          card: this.cardElement.element,
          billing_details: {
            name: this.demoForm.value.name!,
            email: this.demoForm.value.email!
          }
        }
      })
      .subscribe({
        next: (result) => {
          this.demoPaying.set(false);
          if (result.error) {
            this.demoError.set(result.error.message ?? 'Payment failed.');
            return;
          }
          if (result.paymentIntent?.status === 'succeeded') {
            this.demoSucceeded.set(true);
          }
        },
        error: () => {
          this.demoPaying.set(false);
          this.demoError.set('Something went wrong confirming the payment.');
        }
      });
  }

  private primeDemoIfNeeded() {
    const mode = this.step()?.demo;
    if (mode) this.ensureDemoIntent(mode);
  }

  private scrollStepIntoView() {
    queueMicrotask(() => {
      const root = this.host.nativeElement;
      const stage = root.querySelector('[data-tour-stage]') as HTMLElement | null;
      const railBtn = root.querySelector(`[data-tour-step="${this.activeIndex()}"]`) as HTMLElement | null;

      stage?.scrollIntoView({ block: 'start', behavior: 'smooth' });

      const rail = railBtn?.closest('ol');
      if (rail && railBtn && rail.scrollWidth > rail.clientWidth) {
        const left = railBtn.offsetLeft - rail.clientWidth / 2 + railBtn.clientWidth / 2;
        rail.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
      }
    });
  }

  private ensureDemoIntent(mode: FirstPaymentPath) {
    if (this.demoIntentRequested || this.demoSucceeded()) return;
    this.demoIntentRequested = true;
    this.demoReady.set(false);
    this.demoError.set(null);

    this.pluto
      .createPaymentIntent({ amount: 2500, currency: 'usd' })
      .subscribe({
        next: (pi) => {
          const secret = pi.client_secret;
          if (!secret) {
            this.demoIntentRequested = false;
            this.demoError.set('Could not create a test PaymentIntent. Try again in a moment.');
            this.cdr.detectChanges();
            return;
          }
          if (mode === 'payment') {
            this.elementsOptions.clientSecret = secret;
          } else {
            this.cardClientSecret = secret;
          }
          this.demoReady.set(true);
          this.cdr.detectChanges();
        },
        error: () => {
          this.demoIntentRequested = false;
          this.demoError.set('Could not create a test PaymentIntent. Try again in a moment.');
          this.cdr.detectChanges();
        }
      });
  }

  private resetDemo() {
    this.demoIntentRequested = false;
    this.demoReady.set(false);
    this.demoSucceeded.set(false);
    this.demoPaying.set(false);
    this.demoError.set(null);
    this.cardClientSecret = null;
    this.elementsOptions = {
      locale: 'en',
      appearance: { theme: 'stripe' }
    };
  }
}
