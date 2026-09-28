import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgStrLanesService } from '../../core/lanes/lanes.service';
import { laneId } from '../../core/lanes/lanes.model';

@Component({
  selector: 'ngstr-version-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <label class="flex items-center gap-2 text-sm text-gray-600" data-testid="version-picker">
      <span class="hidden lg:inline font-medium text-gray-500">Docs lane</span>
      <select
        class="rounded-md border border-gray-300 bg-white py-1.5 pl-2 pr-8 text-sm text-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        [ngModel]="laneId(lanes.selected())"
        (ngModelChange)="lanes.setLane($event)"
        aria-label="Select Angular and Stripe.js docs lane"
      >
        @for (opt of lanes.activeOptions(); track opt.id) {
        <option [value]="opt.id">{{ opt.label }}</option>
        }
      </select>
    </label>
  `
})
export class NgStrVersionPickerComponent {
  readonly lanes = inject(NgStrLanesService);
  readonly laneId = laneId;
}
