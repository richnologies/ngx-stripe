import { Component } from '@angular/core';

@Component({
  selector: 'ngstr-highlight',
  template: `
    <span
      class="ngstr-highlight rounded-md bg-ngst-accent-soft px-1.5 py-0.5 font-mono text-[0.85em] font-medium text-ngst-accent-dark"
    >
      <ng-content />
    </span>
  `,
  standalone: true
})
export class NgStrHighlightComponent {}
