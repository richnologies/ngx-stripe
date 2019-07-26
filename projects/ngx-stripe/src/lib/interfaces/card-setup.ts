import { Error, Address } from './utils';

export interface SetupIntent {
  id: string;
  object: string;
  client_secret: string;
  created: Date;
  description: string;
  livemode: boolean;
  next_action: {
    redirect_to_url: {
      return_url: string;
      url: string;
    }
    type: string;
    use_stripe_sdk: any;
  };
  payment_method: string;
  status: string;
  usage: string;
}

export interface CardSetupResult {
  setupIntent?: SetupIntent;
  error?: Error;
}
