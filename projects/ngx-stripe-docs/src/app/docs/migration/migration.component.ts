import { Component } from '@angular/core';
import { DocsElementsModule } from '../../docs-elements/docs-elements.module';

@Component({
  selector: 'ngstr-migration',
  templateUrl: './migration.component.html',
  standalone: true,
  imports: [DocsElementsModule]
})
export class NgStrMigrationComponent {
  paymentIntentResultNext = '{ paymentIntent?: PaymentIntent; error?: StripeError; }';
  cardSetupResultNext = '{ setupIntent?: SetupIntent; error?: StripeError; }';
  sourceResultNext = '{ source?: Source; error?: StripeError }';
  tokenResultNext = '{ token?: Token; error?: StripeError }';
}
