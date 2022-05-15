import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngstr-panel',
  template: `
    <div class="py-6 px-8 rounded-md border-l-8" [ngClass]="{
      'bg-green-100': type === 'success',
      'text-green-700': type === 'success',
      'border-green-400': type === 'success',
      'bg-blue-100': type === 'info',
      'text-blue-700': type === 'info',
      'border-blue-400': type === 'info',
      'bg-yellow-100': type === 'warning',
      'text-yellow-700': type === 'warning',
      'border-yellow-400': type === 'warning',
      'bg-red-100': type === 'danger',
      'text-red-700': type === 'danger',
      'border-red-400': type === 'danger'
    }">
      <ng-content></ng-content>
    </div>
  `
})
export class NgStrPanelComponent {
  @Input() type: 'success' | 'info' | 'warning' | 'danger' = 'info';
}
