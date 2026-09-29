import {
  Component,
  HostListener,
  OnDestroy,
  afterNextRender,
  signal
} from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgStrCodeComponent } from '../docs-elements';

import {
  FIRST_PAYMENT_WELCOME_SLIDES,
  FirstPaymentPath,
  FirstPaymentWelcomeSlide,
  welcomeSnippetFor
} from '../docs/first-payment/first-payment.content';

@Component({
  selector: 'ngstr-welcome',
  templateUrl: './welcome.component.html',
  standalone: true,
  imports: [RouterModule, NgStrCodeComponent],
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        padding-bottom: 1px;
        background-color: #dde4f2;
        background-image: radial-gradient(ellipse 90% 70% at 10% -20%, rgba(99, 91, 255, 0.2), transparent 50%),
          radial-gradient(ellipse 70% 55% at 95% 5%, rgba(221, 42, 123, 0.08), transparent 45%),
          radial-gradient(ellipse 50% 40% at 50% 100%, rgba(14, 165, 233, 0.1), transparent 50%),
          linear-gradient(165deg, #e9edf6 0%, #e4e9f4 40%, #dde4f2 100%);
      }

      .ngst-welcome-shell {
        min-height: 100vh;
        padding-bottom: 0.5rem;
      }

      .ngst-panel {
        background: rgba(255, 255, 255, 0.55);
        border: 1px solid rgba(228, 233, 242, 0.9);
        backdrop-filter: blur(10px);
      }

      .ngst-panel-deep {
        background: rgba(11, 18, 32, 0.92);
        border: 1px solid rgba(255, 255, 255, 0.08);
      }

      .ngst-panel-deep ngstr-code {
        display: block;
        flex: 1 1 auto;
        min-height: 0;
        min-width: 0;
        max-width: 100%;
        width: 100%;
        margin: 0;
        overflow: hidden;
      }

      /* ngstr-code uses ViewEncapsulation.None; pierce so the panel owns the scrollport */
      :host ::ng-deep .ngst-panel-deep ngstr-code pre.ngstr-code {
        height: 100%;
        max-width: 100%;
        margin: 0;
        overflow-x: auto;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }

      :host ::ng-deep .ngst-panel-deep ngstr-code pre code.hljs {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        display: block;
        width: max-content !important;
        min-width: 100% !important;
        min-height: 100%;
        box-sizing: border-box;
        overflow: visible !important;
        font-size: 0.72rem !important;
        line-height: 1.6;
        padding: 1rem !important;
      }

      @media (min-width: 640px) {
        :host ::ng-deep .ngst-panel-deep ngstr-code pre code.hljs {
          font-size: 0.78rem !important;
          padding: 1.25rem !important;
        }
      }

      .ngst-sponsors {
        background: linear-gradient(
          135deg,
          rgba(213, 220, 235, 0.95) 0%,
          rgba(228, 233, 244, 0.72) 48%,
          rgba(214, 220, 238, 0.9) 100%
        );
        border: 1px solid rgba(15, 23, 42, 0.08);
        backdrop-filter: blur(10px);
        box-shadow:
          0 1px 2px rgba(15, 23, 42, 0.04),
          0 12px 32px rgba(15, 23, 42, 0.07);
      }

      .ngst-support-channel {
        background: linear-gradient(160deg, rgba(255, 255, 255, 0.42) 0%, rgba(232, 237, 247, 0.55) 100%);
        border: 1px solid rgba(15, 23, 42, 0.08);
        backdrop-filter: blur(10px);
        box-shadow:
          0 1px 2px rgba(15, 23, 42, 0.03),
          0 10px 28px rgba(15, 23, 42, 0.05);
      }

      .ngst-support-channel:hover {
        background: linear-gradient(160deg, rgba(255, 255, 255, 0.62) 0%, rgba(236, 240, 249, 0.78) 100%);
        border-color: rgba(99, 91, 255, 0.2);
        box-shadow:
          0 1px 2px rgba(15, 23, 42, 0.04),
          0 14px 32px rgba(15, 23, 42, 0.08);
        transform: translateY(-1px);
      }

      .ngst-feature {
        transition: background 0.2s ease;
      }

      .ngst-feature:hover {
        background: rgba(255, 255, 255, 0.72);
      }

      .ngst-tour-fork {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .ngst-tour-fork-active {
        background: rgba(99, 91, 255, 0.16);
        border-color: rgba(165, 160, 255, 0.45);
      }

      .ngst-tour-play-ring {
        box-shadow: 0 0 0 0 rgba(99, 91, 255, 0.45);
        animation: ngst-tour-pulse 1.6s ease-out infinite;
      }

      .ngst-tour-play-dot {
        animation: ngst-tour-blink 1.2s ease-in-out infinite;
      }

      @keyframes ngst-tour-pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(99, 91, 255, 0.45);
        }
        70% {
          box-shadow: 0 0 0 8px rgba(99, 91, 255, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(99, 91, 255, 0);
        }
      }

      @keyframes ngst-tour-blink {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.35;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .ngst-tour-play-ring,
        .ngst-tour-play-dot {
          animation: none;
        }
      }

      @keyframes ngst-hero-in {
        from {
          opacity: 0;
          transform: translateY(12px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .ngst-hero-mark,
      .ngst-hero-title,
      .ngst-hero-sub,
      .ngst-hero-cta,
      .ngst-hero-badge {
        animation: ngst-hero-in 0.55s ease-out both;
      }

      .ngst-hero-badge {
        animation-delay: 0.04s;
      }

      .ngst-hero-title {
        animation-delay: 0.1s;
      }

      .ngst-hero-sub {
        animation-delay: 0.18s;
      }

      .ngst-hero-cta {
        animation-delay: 0.26s;
      }

      @media (prefers-reduced-motion: reduce) {
        .ngst-hero-mark,
        .ngst-hero-title,
        .ngst-hero-sub,
        .ngst-hero-cta,
        .ngst-hero-badge,
        .ngst-feature {
          animation: none;
          transition: none;
        }
      }
    `
  ]
})
export default class NgStrWelcomeComponent implements OnDestroy {
  readonly slides = FIRST_PAYMENT_WELCOME_SLIDES;
  readonly activeStep = signal(0);
  selectedPath: FirstPaymentPath = 'payment';
  /** Autoplay runs on desktop until the user clicks a step tab; off on mobile / reduced motion */
  readonly autoplay = signal(false);

  private autoplayTimer: ReturnType<typeof setInterval> | null = null;
  private readonly autoplayMs = 4000;

  constructor() {
    afterNextRender(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isMobile = window.matchMedia('(max-width: 639px)').matches;
      if (reduceMotion || isMobile) {
        return;
      }
      this.startAutoplay();
    });
  }

  get slide(): FirstPaymentWelcomeSlide {
    return this.slides[this.activeStep()];
  }

  get snippet(): string | null {
    return welcomeSnippetFor(this.slide, this.selectedPath);
  }

  get isFirst(): boolean {
    return this.activeStep() === 0;
  }

  get isLast(): boolean {
    return this.activeStep() === this.slides.length - 1;
  }

  ngOnDestroy() {
    this.stopAutoplay();
  }

  prev() {
    if (!this.isFirst) this.activeStep.update((i) => i - 1);
  }

  next() {
    if (!this.isLast) this.activeStep.update((i) => i + 1);
  }

  /** Step tabs: jump + stop autoplay */
  goTo(index: number) {
    if (index < 0 || index >= this.slides.length) return;
    this.activeStep.set(index);
    this.pauseAutoplay();
  }

  selectPath(path: FirstPaymentPath) {
    this.selectedPath = path;
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement | null;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.prev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.next();
    }
  }

  private startAutoplay() {
    this.stopAutoplay();
    this.autoplay.set(true);
    this.autoplayTimer = setInterval(() => {
      if (!this.autoplay()) return;
      this.activeStep.update((i) => (i + 1) % this.slides.length);
    }, this.autoplayMs);
  }

  private pauseAutoplay() {
    this.autoplay.set(false);
    this.stopAutoplay();
  }

  private stopAutoplay() {
    if (this.autoplayTimer != null) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }
}
