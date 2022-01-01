import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-migration',
  templateUrl: './migration.component.html',
  encapsulation: ViewEncapsulation.None
})
export class NgStrMigrationComponent {
  paymentIntentResultNext = '{ paymentIntent?: PaymentIntent; error?: StripeError; }';
  cardSetupResultNext = '{ setupIntent?: SetupIntent; error?: StripeError; }';
  sourceResultNext = '{ source?: Source; error?: StripeError }';
  tokenResultNext = '{ token?: Token; error?: StripeError }';
}
