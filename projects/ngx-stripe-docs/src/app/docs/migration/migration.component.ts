import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  NgStrDocsHeaderComponent,
  NgStrHighlightComponent,
  NgStrSectionComponent,
  NgStrSubheaderComponent
} from '../../docs-elements';

@Component({
  selector: 'ngstr-migration',
  templateUrl: './migration.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgStrDocsHeaderComponent,
    NgStrHighlightComponent,
    NgStrSectionComponent,
    NgStrSubheaderComponent
  ]
})
export default class NgStrMigrationComponent {
  paymentIntentResultNext = '{ paymentIntent?: PaymentIntent; error?: StripeError; }';
  cardSetupResultNext = '{ setupIntent?: SetupIntent; error?: StripeError; }';
  sourceResultNext = '{ source?: Source; error?: StripeError }';
  tokenResultNext = '{ token?: Token; error?: StripeError }';
}
