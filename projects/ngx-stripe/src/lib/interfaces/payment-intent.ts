import { Error, Address } from './utils';

export interface HandleCardPaymentOptions {
  source_data?: {
    owner?: {
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
  save_source_to_customer?: boolean;
}

export interface ConfirmPaymentIntentOptions extends HandleCardPaymentOptions {
  return_url?: string;
  use_stripe_sdk?: boolean;
  source?: string;
}

export interface PaymentIntent {
  id: string;
  object: 'payment_intent';
  allowed_source_types: string[];
  amount: number;
  amount_capturable: number;
  amount_received: number;
  application: string;
  application_fee_amount: number;
  canceled_at: Date;
  cancellation_reason: string;
  capture_method: string;
  charges: any; // Todo
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
  status:
    | 'requires_source'
    | 'requires_confirmation'
    | 'requires_source_action'
    | 'processing'
    | 'requires_capture'
    | 'canceled'
    | 'succeeded';
  transfer_data: any; // Todo
  transfer_group: string;
}

export interface PaymentIntentResult {
  paymentIntent?: PaymentIntent;
  error?: Error;
}
