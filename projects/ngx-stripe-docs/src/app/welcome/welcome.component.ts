import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'ngstr-welcome',
  templateUrl: './welcome.component.html',
  standalone: true,
  imports: [RouterModule],
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
        background: linear-gradient(
          160deg,
          rgba(255, 255, 255, 0.42) 0%,
          rgba(232, 237, 247, 0.55) 100%
        );
        border: 1px solid rgba(15, 23, 42, 0.08);
        backdrop-filter: blur(10px);
        box-shadow:
          0 1px 2px rgba(15, 23, 42, 0.03),
          0 10px 28px rgba(15, 23, 42, 0.05);
      }

      .ngst-support-channel:hover {
        background: linear-gradient(
          160deg,
          rgba(255, 255, 255, 0.62) 0%,
          rgba(236, 240, 249, 0.78) 100%
        );
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
export default class NgStrWelcomeComponent {}
