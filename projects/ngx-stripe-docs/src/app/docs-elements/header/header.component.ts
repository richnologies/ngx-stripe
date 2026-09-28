import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngstr-header',
  template: `
    <div class="mb-2">
      <h1>
        @if (supertitle) {
        <span class="mb-2 block text-sm font-semibold tracking-wide text-ngst-accent">
          {{ supertitle }}
        </span>
        }
        @if (title) {
        <span class="block text-2xl font-extrabold tracking-tight text-ngst-ink sm:text-3xl lg:text-4xl">
          {{ title }}
        </span>
        }
      </h1>
      @if (subtitle && subtitle.length > 0) {
      <p class="mt-2 text-base text-ngst-muted">{{ subtitle }}</p>
      }
      @if (showDivider) {
      <div class="my-6 h-px w-full bg-gradient-to-r from-ngst-line via-ngst-accent/30 to-transparent"></div>
      }
    </div>
  `,
  standalone: true
})
export class NgStrDocsHeaderComponent {
  @Input() supertitle: string;
  @Input() title: string;
  @Input() subtitle: string;

  @Input() showDivider = true;
}
