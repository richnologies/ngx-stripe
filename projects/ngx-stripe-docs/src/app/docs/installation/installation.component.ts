import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NgStrLanesService } from '../../core/lanes/lanes.service';
import {
  NgStrCodeComponent,
  NgStrDocsHeaderComponent,
  NgStrHighlightComponent,
  NgStrSectionComponent,
  NgStrSubheaderComponent
} from '../../docs-elements';
import { NgStrLaneBannerComponent } from '../../docs-elements/lane-banner/lane-banner.component';
import { NgStrOwnershipCalloutComponent } from '../../docs-elements/ownership-callout/ownership-callout.component';

@Component({
  selector: 'ngstr-installation',
  templateUrl: './installation.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgStrCodeComponent,
    NgStrDocsHeaderComponent,
    NgStrHighlightComponent,
    NgStrLaneBannerComponent,
    NgStrOwnershipCalloutComponent,
    NgStrSectionComponent,
    NgStrSubheaderComponent
  ]
})
export default class NgStrInstallationComponent {
  readonly lanes = inject(NgStrLanesService);
}
