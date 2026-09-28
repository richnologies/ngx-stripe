import { Component, inject } from '@angular/core';

import { NgStrLanesService } from '../../core/lanes/lanes.service';
import {
  NgStrCodeComponent,
  NgStrDocsHeaderComponent,
  NgStrHighlightComponent,
  NgStrPanelComponent,
  NgStrSectionComponent,
  NgStrSubheaderComponent
} from '../../docs-elements';
import { NgStrLaneBannerComponent } from '../../docs-elements/lane-banner/lane-banner.component';

@Component({
  selector: 'ngstr-versioning',
  templateUrl: './versioning.component.html',
  standalone: true,
  imports: [
    NgStrCodeComponent,
    NgStrDocsHeaderComponent,
    NgStrHighlightComponent,
    NgStrLaneBannerComponent,
    NgStrPanelComponent,
    NgStrSectionComponent,
    NgStrSubheaderComponent
  ]
})
export default class NgStrVersioningComponent {
  readonly lanes = inject(NgStrLanesService);
}
