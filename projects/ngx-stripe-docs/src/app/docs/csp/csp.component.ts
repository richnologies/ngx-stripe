import { Component } from '@angular/core';

import {
  NgStrCodeComponent,
  NgStrDocsHeaderComponent,
  NgStrHighlightComponent,
  NgStrPanelComponent,
  NgStrSectionComponent,
  NgStrSubheaderComponent
} from '../../docs-elements';
import { NgStrLaneBannerComponent } from '../../docs-elements/lane-banner/lane-banner.component';
import { NgStrOwnershipCalloutComponent } from '../../docs-elements/ownership-callout/ownership-callout.component';

@Component({
  selector: 'ngstr-csp',
  templateUrl: './csp.component.html',
  standalone: true,
  imports: [
    NgStrCodeComponent,
    NgStrDocsHeaderComponent,
    NgStrHighlightComponent,
    NgStrLaneBannerComponent,
    NgStrOwnershipCalloutComponent,
    NgStrPanelComponent,
    NgStrSectionComponent,
    NgStrSubheaderComponent
  ]
})
export default class NgStrCspComponent {
  readonly cspExample = `Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://js.stripe.com;
  frame-src https://js.stripe.com https://hooks.stripe.com;
  connect-src 'self' https://api.stripe.com;
  img-src 'self' https://*.stripe.com;
  # Only if you enforce Trusted Types on scripts:
  # trusted-types angular angular#unsafe-bypass ngx-stripe;
  # require-trusted-types-for 'script';`;
}
