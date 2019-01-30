/*
 * Public API Surface of ngx-stripe
 */

export { NgxStripeModule } from './lib/ngx-stripe.module';

export { StripeCardComponent } from './lib/components/stripe-card.component';

export { StripeService } from './lib/services/stripe.service';
export { StripeFactoryService } from './lib/services/stripe-factory.service';
export { StripeInstance } from './lib/services/stripe-instance.class';
export {
  StripeServiceInterface
} from './lib/services/stripe-instance.interface';
export { LazyStripeAPILoader } from './lib/services/api-loader.service';

export { WindowRef } from './lib/services/window-ref.service';
export { DocumentRef } from './lib/services/document-ref.service';

export {
  Element,
  ElementEventType,
  ElementType,
  ElementOptions,
  ElementStyleAttributes
} from './lib/interfaces/element';

export {
  Elements,
  ElementsOptions,
  FontElement
} from './lib/interfaces/elements';

export {
  Source,
  UsageTypes,
  FlowTypes,
  SourceParams,
  SourceData,
  isSourceData,
  SourceResult
} from './lib/interfaces/sources';

export {
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_OPTIONS,
  StripeJS,
  Options
} from './lib/interfaces/stripe';

export {
  Token,
  FieldCheck,
  CardDataOptions,
  TokenResult,
  BankAccount,
  BankAccountData,
  Pii,
  PiiData,
  isBankAccount,
  isBankAccountData,
  isPii,
  isPiiData
} from './lib/interfaces/token';

export { Error, Address } from './lib/interfaces/utils';
