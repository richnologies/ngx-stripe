import { Error } from './utils';

export interface Token {
  id: string;
  object: 'token';
  bank_account?: {
    id: string;
    country: string;
    currency: string;
    fingerprint: string;
    object: 'bank_account';
    account_holder_name: string;
    account_holder_type: 'individual' | 'company';
    bank_name: string;
    last4: string;
    routing_number: string;
    status:
      | 'new'
      | 'validated'
      | 'verified'
      | 'verification_failded'
      | 'errored';
  };
  card?: {
    id: string;
    country: string;
    currency: string;
    fingerprint: string;
    object: 'card';
    address_city: string;
    address_country: string;
    address_line1: string;
    address_line1_check: FieldCheck;
    address_line2: string;
    address_state: string;
    address_zip: string;
    address_zip_check: FieldCheck;
    brand: string;
    cvc_check: FieldCheck;
    dynamic_last4: string;
    exp_month: number;
    exp_year: number;
    funding: 'credit' | 'debit' | 'prepaid' | 'unknown';
    last4: string;
    metadata: { [key: string]: any };
    name: string;
    tokenization_method: 'apple_pay' | 'android_pay';
  };
  client_ip: string;
  livemode: boolean;
  type: 'card' | 'bank_account';
  used: boolean;
}

export type FieldCheck = 'pass' | 'fail' | 'unavailable' | 'unchecked';

export interface CardDataOptions {
  name?: string;
  address_line1?: string;
  address_line2?: string;
  address_city?: string;
  address_state?: string;
  address_zip?: string;
  address_country?: string;
  currency?: string;
}

export interface TokenResult {
  token?: Token;
  error?: Error;
}

export type BankAccount = 'bank_account';

export interface BankAccountData {
  country: string;
  currency: string;
  routing_number: string;
  account_number: string;
  account_holder_name: string;
  account_holder_type: 'individual' | 'company';
}

export type Pii = 'pii';

export interface PiiData {
  personal_id_number: string;
}

export function isBankAccount(account: any): account is BankAccount {
  return account === 'bank_account';
}

export function isBankAccountData(
  bankAccountData: any
): bankAccountData is BankAccountData {
  return (
    'country' in bankAccountData &&
    'currency' in bankAccountData &&
    'routing_number' in bankAccountData &&
    'account_number' in bankAccountData &&
    'account_holder_name' in bankAccountData &&
    'account_holder_type' in bankAccountData &&
    (bankAccountData.account_holder_type === 'individual' ||
      bankAccountData.account_holder_type === 'company')
  );
}

export function isPii(pii: any): pii is Pii {
  return pii === 'pii';
}

export function isPiiData(piiData: any): piiData is PiiData {
  return 'personal_id_number' in piiData;
}
