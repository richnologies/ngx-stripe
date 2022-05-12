import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngstr-link',
  template: `
    <a class="ngstr-link" [href]="url" [target]="target" [rel]="rel">
      <ng-content></ng-content>
    </a>
  `,
  styles: [
    `
      a.ngstr-link {
        text-decoration: none;
        color: rgb(20, 81, 179);
        background-color: rgb(245, 247, 249);
        border-radius: 4px;
        padding-left: 4px;
        padding-right: 4px;
        cursor: pointer;
        font-weight: normal;
      }
    `
  ]
})
export class NgStrLinkComponent {
  @Input() url: string;
  @Input() target = '_blank';
  @Input() rel = 'noopener noreferrer';
}
