import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngstr-panel',
  template: `
    <div
      class="rounded-2xl border px-5 py-4 sm:px-6 sm:py-5"
      [ngClass]="{
        'border-emerald-200/80 bg-emerald-50 text-emerald-900': type === 'success',
        'border-ngst-accent/20 bg-ngst-accent-soft text-ngst-ink': type === 'info',
        'border-amber-200/80 bg-amber-50 text-amber-950': type === 'warning',
        'border-rose-200/80 bg-rose-50 text-rose-950': type === 'danger'
      }"
    >
      <ng-content></ng-content>
    </div>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class NgStrPanelComponent {
  @Input() type: 'success' | 'info' | 'warning' | 'danger' = 'info';
}
