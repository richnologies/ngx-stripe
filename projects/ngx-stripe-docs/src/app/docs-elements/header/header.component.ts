import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngstr-header',
  template: `
    <div class="text-lg max-w-prose mx-auto">
      <h1>
        <span class="block text-base text-indigo-600 font-semibold tracking-wide uppercase" *ngIf="supertitle">{{
          supertitle
        }}</span>
        <span
          class="mt-2 block text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
          *ngIf="title"
          >{{ title }}</span
        >
      </h1>
      <p class="text-gray-400" *ngIf="subtitle && subtitle.length > 0">
        {{ subtitle }}
      </p>
      <hr class="my-4" *ngIf="showDivider" />
    </div>
  `
})
export class NgStrDocsHeaderComponent {
  @Input() supertitle: string;
  @Input() title: string;
  @Input() subtitle: string;

  @Input() showDivider = true;
}
