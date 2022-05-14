import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngstr-contents',
  template: `
    <div class="border-l-2">
      <h3 class="block mt-6 !mb-1.5 px-4 font-semibold text-gray-400 uppercase tracking-wider">
        <span class="material-icons text-xs mr-3">subject</span>
        <span class="text-xs">Contents</span>
      </h3>
      <a
        class="block cursor-pointer font-normal px-5 py-1 text-sm text-gray-500 hover:text-indigo-600"
        [ngClass]="{
          'text-gray-500': active !== content.id,
          'text-indigo-600': active === content.id,
          'border-l-2': active === content.id,
          'border-indigo-500': active === content.id,
          '-ml-0.5': active === content.id
        }"
        [href]="content.href"
        *ngFor="let content of contents"
      >
        <span>{{ content.name }}</span>
      </a>
    </div>
  `
})
export class NgStrContentsComponent {
  @Input() contents: Array<{ name: string; href: string; id: string }> = [];
  @Input() active: string = 'create-subscription';
}
