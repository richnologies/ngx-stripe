import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  NgStrContainerComponent,
  NgStrDocsHeaderComponent,
  NgStrHighlightComponent,
  NgStrPanelComponent,
  NgStrSectionComponent
} from '../../docs-elements';

@Component({
  selector: 'ngstr-payment-request-button',
  templateUrl: './payment-request-button.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgStrContainerComponent,
    NgStrDocsHeaderComponent,
    NgStrHighlightComponent,
    NgStrPanelComponent,
    NgStrSectionComponent
  ]
})
export default class NgStrPaymentRequestButtonComponent {}
