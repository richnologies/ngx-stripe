import { Error, Address } from './utils';

export interface HandleCardPaymentOptions {
  payment_method_data?: {
    billing_details?: {
      address?: Address;
      email?: string;
      name?: string;
      phone?: string;
    };
  };
  shipping?: {
    address: Address;
    name: string;
    carrier?: string;
    phone?: string;
    tracking_number?: string;
  };
  receipt_email?: string;
  save_payment_method?: boolean;
}

export interface ConfirmPaymentIntentOptions extends HandleCardPaymentOptions {
  return_url?: string;
  use_stripe_sdk?: boolean;
  source?: string;
}

export interface PaymentIntent {
  id: string;
  object: string;
  amount: number;
  amount_capturable: number;
  amount_received: number;
  application: string;
  application_fee_amount: number;
  canceled_at: Date;
  cancellation_reason: string;
  capture_method: string;
  charges: {
    object: string;
    data: any[];
    has_more: boolean;
    total_count: number;
    url: string;
  };
  client_secret: string;
  confirmation_method: string;
  created: Date;
  currency: string;
  customer: string;
  description: string;
  last_payment_error: any; // Todo
  livemode: boolean;
  metadata: { [key: string]: any };
  next_source_action: any; // Todo
  on_behalf_of: string;
  payment_method: string;
  payment_method_types: string[];
  receipt_email: string;
  review: string;
  shipping: {
    address: Address;
    carrier: string;
    name: string;
    phone: string;
    tracking_number: string;
  };
  source: string;
  statement_descriptor: string;
  status: string;
  transfer_data: any; // Todo
  transfer_group: string;
}

export interface PaymentIntentResult {
  paymentIntent?: PaymentIntent;
  error?: Error;
}

export interface PaymentMethodData {
  type?: string;
  billing_details?: {
    address?: Address;
    email?: string;
    name?: string;
    phone?: string;
  };
  card?: {
    exp_month?: number;
    exp_year?: number;
    number?: string;
    cvc?: string;
  };
  metadata: { [key: string]: any };
}

export interface PaymentMethodResult {
  id: string;
  object: string;
  billing_details?: {
    address?: Address;
    email?: string;
    name?: string;
    phone?: string;
  };
  card: {
    brand: string;
    checks: {
      address_line1_check: string;
      address_postal_code_check: string;
      cvc_check: string;
    };
    country: string;
    exp_month: number;
    exp_year: number;
    fingerprint: string;
    funding: string;
    generated_from: string;
    last4: string;
    three_d_secure_usage: {
      supported: boolean;
    };
    wallet: string;
  };
  created: number;
  customer: string;
  livemode: boolean;
  metadata: { [key: string]: any };
  type: string;
}
