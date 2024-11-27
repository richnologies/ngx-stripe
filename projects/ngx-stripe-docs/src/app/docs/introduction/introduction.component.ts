import { Component } from '@angular/core';

import {
  NgStrDocsHeaderComponent,
  NgStrLinkComponent,
  NgStrSectionComponent,
  NgStrSubheaderComponent
} from '../../docs-elements';

@Component({
  selector: 'ngstr-introduction',
  templateUrl: './introduction.component.html',
  standalone: true,
  imports: [
    NgStrDocsHeaderComponent,
    NgStrLinkComponent,
    NgStrSectionComponent,
    NgStrSubheaderComponent
  ]
})
export default class NgStrIntroductionComponent {}
