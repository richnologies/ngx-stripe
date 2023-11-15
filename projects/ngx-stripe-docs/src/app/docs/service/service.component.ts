import { Component } from '@angular/core';

import { NgStrDocsHeaderComponent, NgStrLinkComponent, NgStrSectionComponent } from '../../docs-elements';

@Component({
  selector: 'ngstr-service',
  templateUrl: './service.component.html',
  standalone: true,
  imports: [NgStrDocsHeaderComponent, NgStrLinkComponent, NgStrSectionComponent]
})
export default class NgStrServiceComponent {}
