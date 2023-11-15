import { Component, Input, ViewEncapsulation } from '@angular/core';

import { HighlightModule } from 'ngx-highlightjs';

import { NgStrCodeFormatPipe } from './code-format.pipe';

@Component({
  selector: 'ngstr-code',
  template: `
    @if (!hidden) {
    <pre class="ngstr-code not-prose">
        <code [highlight]="code | ngStrCodeFormat"></code>
      </pre>
    }
  `,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [HighlightModule, NgStrCodeFormatPipe]
})
export class NgStrCodeComponent {
  @Input() name?: string;
  @Input() code: string;

  hidden: boolean = false;
}
