import { Component } from '@angular/core';

@Component({
  selector: 'ngstr-migration',
  templateUrl: './migration.component.html'
})
export class NgStrMigrationComponent {
  paymentIntentResultNext = '{ paymentIntent?: PaymentIntent; error?: StripeError; }';
  cardSetupResultNext = '{ setupIntent?: SetupIntent; error?: StripeError; }';
  sourceResultNext = '{ source?: Source; error?: StripeError }';
  tokenResultNext = '{ token?: Token; error?: StripeError }';
}
