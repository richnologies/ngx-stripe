import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngstr-link',
  template: `
    <a
      class="hover:text-indigo-400 text-indigo-600 bg-slate-100 font-normal px-1 rounded cursor-pointer no-underline"
      [href]="url"
      [target]="target"
      [rel]="rel"
    >
      <ng-content></ng-content>
    </a>
  `
})
export class NgStrLinkComponent {
  @Input() url: string;
  @Input() target = '_blank';
  @Input() rel = 'noopener noreferrer';
}
