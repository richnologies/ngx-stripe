import { Component } from '@angular/core';

@Component({
  selector: 'ngstr-highlight',
  template: `<span class="ngstr-highlight"><ng-content></ng-content></span>`,
  styles: [
    `
      span.ngstr-highlight {
        font-family: gitbook-code-font, Menlo, monospace;
        border-radius: 4px;
        padding-left: 4px;
        padding-right: 4px;
        color: rgb(59, 69, 78);
        background-color: rgb(245, 247, 249);
      }
    `
  ]
})
export class NgStrHighlightComponent {}
