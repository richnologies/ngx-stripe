import { Component } from '@angular/core';

@Component({
  selector: 'ngstr-highlight',
  template: `
    <span class="ngstr-highlight font-mono text-gray-700 bg-slate-100 px-1 rounded">
      <ng-content></ng-content>
    </span>
  `
})
export class NgStrHighlightComponent {}
