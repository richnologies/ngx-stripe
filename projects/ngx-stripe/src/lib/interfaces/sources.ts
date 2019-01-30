import { Address, Error } from './utils';

export interface Source {
  id: string;
  object: 'source';
  amount: number;
  client_secret: string;
  code_verification?: {
    attempts_remaining: number;
    status: 'pending' | 'succeded' | 'failed';
  };
  created: number;
  currency: string;
  flow: FlowTypes;
  livemode: boolean;
  metadata: { [key: string]: any };
  three_d_secure: {
    card: string;
  };
  owner: {
    address: Address;
    email: string;
    name: string;
    phone: string;
    verified_address: Address;
    verified_email: string;
    verified_name: string;
    verified_phone: string;
  };
  receiver: {
    address: string;
    amount_charged: number;
    amount_received: number;
    amount_returned: number;
    redirect?: {
      return_url: string;
      status: 'pending' | 'succeeded' | 'failed';
      url: string;
    };
  };
  status: 'canceled' | 'chargeable' | 'consumed' | 'failed' | 'pending';
  type:
    | 'card'
    | 'three_d_secure'
    | 'giropay'
    | 'sepa_bit'
    | 'ideal'
    | 'sofort'
    | 'bancontact';
  usage: UsageTypes;
}

export type UsageTypes = 'reusable' | 'single_use';
export type FlowTypes = 'redirect' | 'receiver' | 'code_verification' | 'none';

export interface SourceParams {
  id: string;
  client_secret: string;
}

export interface SourceData {
  type?: string;
  amount?: number;
  currency?: string;
  flow?: FlowTypes;
  metadata?: { [key: string]: any };
  three_d_secure?: {
    card: string;
  };
  owner?: {
    address?: Address;
    email?: string;
    name?: string;
    phone?: string;
  };
  redirect?: {
    [key: string]: any;
    return_url: string;
  };
  token?: string;
  usage?: UsageTypes;
}

export function isSourceData(sourceData: any): sourceData is SourceData {
  return 'type' in sourceData;
}

export interface SourceResult {
  source?: Source;
  error?: Error;
}
