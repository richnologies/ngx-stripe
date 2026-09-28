import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NgStrLanesService } from '../../core/lanes/lanes.service';
import { NgStrPanelComponent } from '../panel/panel.component';

@Component({
  selector: 'ngstr-lane-banner',
  standalone: true,
  imports: [NgStrPanelComponent, RouterLink],
  template: `
    @if (!lanes.isLatest()) {
    <ngstr-panel type="warning" class="block mb-6" data-testid="lane-banner">
      <p class="font-semibold mb-1">Viewing docs overlay for {{ lanes.selectedLabel() }}</p>
      <p class="text-sm mb-2">
        Install peers and CDN notes below match this lane. Live Element demos in this site always run on the
        <strong>latest</strong> Angular + Stripe.js line built into the docs app. For a runnable sample on this older
        lane, open the in-repo StackBlitz playground.
      </p>
      <p class="text-sm flex flex-wrap gap-3">
        <a
          class="underline font-medium"
          [href]="lanes.stackblitzUrl()"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="stackblitz-link"
          >Open StackBlitz playground</a
        >
        <a class="underline" routerLink="/docs/versioning">Pick your lane guide</a>
        <button type="button" class="underline" (click)="lanes.setLane(lanes.latestId)">Reset to latest</button>
      </p>
    </ngstr-panel>
    }
  `
})
export class NgStrLaneBannerComponent {
  readonly lanes = inject(NgStrLanesService);
}
