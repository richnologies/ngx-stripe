import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';

import { ngStrElementById } from '../../core/elements/elements.data';
import { NgStrElementEntry } from '../../core/elements/elements.model';

import {
  NgStrBadgeComponent,
  NgStrCodeComponent,
  NgStrCodeGroupComponent,
  NgStrContainerComponent,
  NgStrDocsHeaderComponent,
  NgStrHighlightComponent,
  NgStrLinkComponent,
  NgStrOwnershipCalloutComponent,
  NgStrPanelComponent,
  NgStrSectionComponent,
  NgStrSubheaderComponent
} from '../../docs-elements';

@Component({
  selector: 'ngstr-element-contract',
  templateUrl: './element-contract.component.html',
  standalone: true,
  imports: [
    RouterLink,
    MatDividerModule,
    MatTabsModule,
    NgStrBadgeComponent,
    NgStrCodeComponent,
    NgStrCodeGroupComponent,
    NgStrContainerComponent,
    NgStrDocsHeaderComponent,
    NgStrHighlightComponent,
    NgStrLinkComponent,
    NgStrOwnershipCalloutComponent,
    NgStrPanelComponent,
    NgStrSectionComponent,
    NgStrSubheaderComponent
  ]
})
export default class NgStrElementContractComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly elementId = toSignal(
    this.route.data.pipe(map((data) => data['elementId'] as string)),
    { initialValue: this.route.snapshot.data['elementId'] as string }
  );

  readonly entry = computed(() => ngStrElementById(this.elementId()));

  extraInputs(entry: NgStrElementEntry) {
    return entry.extraInputs ?? [];
  }
}
