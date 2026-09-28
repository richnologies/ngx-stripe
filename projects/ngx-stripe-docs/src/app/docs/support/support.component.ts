import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  NgStrDocsHeaderComponent,
  NgStrHighlightComponent,
  NgStrLaneBannerComponent,
  NgStrPanelComponent,
  NgStrSectionComponent,
  NgStrSubheaderComponent
} from '../../docs-elements';
import { NgStrOwnershipCalloutComponent } from '../../docs-elements/ownership-callout/ownership-callout.component';

@Component({
  selector: 'ngstr-support',
  templateUrl: './support.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgStrDocsHeaderComponent,
    NgStrHighlightComponent,
    NgStrLaneBannerComponent,
    NgStrOwnershipCalloutComponent,
    NgStrPanelComponent,
    NgStrSectionComponent,
    NgStrSubheaderComponent
  ]
})
export default class NgStrSupportComponent {}
