/*
 * Public API Surface of ngx-stripe
 */
export { NgxStripeModule } from './lib/ngx-stripe.module';

export { StripeCardComponent } from './lib/components/card.component';
export { StripeCardNumberComponent } from './lib/components/card-number.component';
export { StripeCardExpiryComponent } from './lib/components/card-expiry.component';
export { StripeCardCvcComponent } from './lib/components/card-cvc.component';
export { StripeFpxBankComponent } from './lib/components/fpx-bank.component';
export { StripeIbanComponent } from './lib/components/iban.component';
export { StripeIdealBankComponent } from './lib/components/ideal-bank.component';
export { StripeAuBankAccountComponent } from './lib/components/au-bank-account.component';
export { StripePaymentRequestButtonComponent } from './lib/components/payment-request-button.component';

export { StripeService } from './lib/services/stripe.service';
export { StripeFactoryService } from './lib/services/stripe-factory.service';
export { StripeInstance } from './lib/services/stripe-instance.class';
export {
  LazyStripeAPILoader,
  LazyStripeAPILoaderStatus
} from './lib/services/api-loader.service';

export { WindowRef } from './lib/services/window-ref.service';
export { DocumentRef } from './lib/services/document-ref.service';
export { StripeElementsService } from './lib/services/stripe-elements.service';

export {
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_OPTIONS
} from './lib/interfaces/ngx-stripe.interface';
export { StripeServiceInterface } from './lib/interfaces/stripe-instance.interface';
