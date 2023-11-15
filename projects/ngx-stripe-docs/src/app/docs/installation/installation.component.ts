import { Component } from '@angular/core';

import {
  NgStrCodeComponent,
  NgStrDocsHeaderComponent,
  NgStrHighlightComponent,
  NgStrSectionComponent,
  NgStrSubheaderComponent
} from '../../docs-elements';

@Component({
  selector: 'ngstr-installation',
  templateUrl: './installation.component.html',
  standalone: true,
  imports: [
    NgStrCodeComponent,
    NgStrDocsHeaderComponent,
    NgStrHighlightComponent,
    NgStrSectionComponent,
    NgStrSubheaderComponent
  ]
})
export default class NgStrInstallationComponent {}
