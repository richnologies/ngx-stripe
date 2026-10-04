import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  NgStrDocsHeaderComponent,
  NgStrHighlightComponent,
  NgStrLinkComponent,
  NgStrSectionComponent,
  NgStrSubheaderComponent
} from '../../docs-elements';

@Component({
  selector: 'ngstr-introduction',
  templateUrl: './introduction.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgStrDocsHeaderComponent,
    NgStrHighlightComponent,
    NgStrLinkComponent,
    NgStrSectionComponent,
    NgStrSubheaderComponent
  ]
})
export default class NgStrIntroductionComponent {}
