import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngstr-code',
  template: `
    <pre class="ngstr-code not-prose" *ngIf="!hidden">
      <code [highlight]="code | ngStrCodeFormat"></code>
    </pre>
  `
})
export class NgStrCodeComponent {
  @Input() name?: string;
  @Input() code: string;

  hidden: boolean = false;
}
