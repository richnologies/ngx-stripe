import { StripeElementsOptionsClientSecret, StripeElementsOptionsMode } from '@stripe/stripe-js';

export interface NgxStripeElementsOptionsClientSecret extends StripeElementsOptionsClientSecret {
  allowedCardBrands?: string[];
  disallowedCardBrands?: string[];
}

export interface NgxStripeElementsOptionsMode extends StripeElementsOptionsMode {
  allowedCountries?: string[];
  disallowedCountries?: string[];
}

export type NgxStripeElementsOptions =
  | NgxStripeElementsOptionsClientSecret
  | NgxStripeElementsOptionsMode;
