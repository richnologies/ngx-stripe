// Public classes.
export { NgxStripeModule } from './modules/ngx-stripe.module';

export { StripeCardComponent } from './components/stripe-card.component';

export { StripeService } from './services/stripe.service';
export { StripeFactoryService } from './services/stripe-factory.service';
export { StripeInstance } from './services/stripe-instance.class';
export { StripeServiceInterface } from './services/stripe-instance.interface';
export { LazyStripeAPILoader } from './services/api-loader.service';

export { WindowRef } from './services/window-ref';
export { DocumentRef } from './services/document-ref';

export {
  Element,
  ElementEventType,
  ElementType,
  ElementOptions,
  ElementStyleAttributes
} from './interfaces/element';

export { Elements, ElementsOptions, FontElement } from './interfaces/elements';

export {
  Source,
  UsageTypes,
  FlowTypes,
  SourceParams,
  SourceData,
  isSourceData,
  SourceResult
} from './interfaces/sources';

export {
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_OPTIONS,
  StripeJS,
  Options
} from './interfaces/stripe';

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
} from './interfaces/token';

export { Error, Address } from './interfaces/utils';
