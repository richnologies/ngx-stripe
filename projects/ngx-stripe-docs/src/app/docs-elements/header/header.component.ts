import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngstr-header',
  template: `
    <div class="text-lg max-w-prose mx-auto">
      <h1>
        @if (supertitle) {
        <span class="block text-base text-indigo-600 font-semibold tracking-wide uppercase">
          {{ supertitle }}
        </span>
        } @if (title) {
        <span class="mt-2 block text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          {{ title }}
        </span>
        }
      </h1>
      @if (subtitle && subtitle.length > 0) {
      <p class="text-gray-400">{{ subtitle }}</p>
      } @if (showDivider) {
      <hr class="my-4" />
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
